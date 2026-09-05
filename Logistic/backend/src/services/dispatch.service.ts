import cron from 'node-cron';
import { getSupabaseAdmin } from '@mandikart/shared-core';

export class DispatchService {
  /**
   * Auto-assigns confirmed orders to available vehicles with sufficient capacity.
   * Prioritizes oldest orders (FIFO — fair for farmers).
   * Prevents double-assignment within the same cron tick.
   * Runs every 5 minutes.
   */
  static startAutoDispatchCron(): void {
    console.log('🚛 Auto-Dispatch Cron started (interval: every 5 mins)');

    cron.schedule('*/5 * * * *', async () => {
      const runId = Date.now();
      console.log(`[Dispatch:${runId}] Tick — checking for unassigned orders...`);

      const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
      if (isMock) {
        console.log(`[Dispatch:${runId}] MOCK ENV active — skipping real dispatch.`);
        return;
      }

      try {
        const supabase = getSupabaseAdmin();

        // 1. Fetch unassigned confirmed orders — OLDEST FIRST (FIFO priority)
        const { data: pendingOrders, error: ordersErr } = await supabase
          .from('orders')
          .select('id, quantity_kg, created_at')
          .eq('status', 'CONFIRMED')
          .is('assigned_driver_id', null)
          .order('created_at', { ascending: true }); // oldest first

        if (ordersErr) {
          console.error(`[Dispatch:${runId}] Error fetching orders:`, ordersErr.message);
          return;
        }

        if (!pendingOrders || pendingOrders.length === 0) {
          console.log(`[Dispatch:${runId}] No unassigned orders. Done.`);
          return;
        }

        console.log(`[Dispatch:${runId}] ${pendingOrders.length} unassigned order(s) found.`);

        // 2. Fetch available vehicles with assigned drivers
        const { data: availableVehicles, error: vehiclesErr } = await supabase
          .from('vehicles')
          .select('id, driver_id, capacity_kg')
          .eq('status', 'AVAILABLE')
          .not('driver_id', 'is', null);

        if (vehiclesErr) {
          console.error(`[Dispatch:${runId}] Error fetching vehicles:`, vehiclesErr.message);
          return;
        }

        if (!availableVehicles || availableVehicles.length === 0) {
          console.log(`[Dispatch:${runId}] No available vehicles. Done.`);
          return;
        }

        // 3. Mutable copy to prevent double-assignment within this tick
        const remainingVehicles = [...availableVehicles];
        let dispatched = 0;

        for (const order of pendingOrders) {
          if (remainingVehicles.length === 0) break;

          const vehicleIdx = remainingVehicles.findIndex(
            (v: any) => v.capacity_kg >= (order as any).quantity_kg
          );

          if (vehicleIdx === -1) {
            console.warn(`[Dispatch:${runId}] No suitable vehicle for Order ${(order as any).id} (${(order as any).quantity_kg}kg)`);
            continue;
          }

          const vehicle = remainingVehicles[vehicleIdx];

          // Remove immediately to prevent double-assignment
          remainingVehicles.splice(vehicleIdx, 1);

          // 4. Atomic assignment
          const [orderUpdate, vehicleUpdate] = await Promise.all([
            supabase
              .from('orders')
              .update({
                status: 'PICKUP_SCHEDULED',
                assigned_driver_id: vehicle.driver_id,
                assigned_vehicle_id: vehicle.id,
              })
              .eq('id', (order as any).id)
              .eq('status', 'CONFIRMED'), // guard against race condition

            supabase
              .from('vehicles')
              .update({ status: 'BUSY' })
              .eq('id', vehicle.id)
              .eq('status', 'AVAILABLE'), // guard against race condition
          ]);

          if (orderUpdate.error) {
            console.error(`[Dispatch:${runId}] Failed to assign Order ${(order as any).id}:`, orderUpdate.error.message);
          } else {
            console.log(`[Dispatch:${runId}] ✅ Order ${(order as any).id} → Vehicle ${vehicle.id} (Driver ${vehicle.driver_id})`);
            dispatched++;
          }

          if (vehicleUpdate.error) {
            console.warn(`[Dispatch:${runId}] Failed to mark Vehicle ${vehicle.id} as BUSY:`, vehicleUpdate.error.message);
          }
        }

        console.log(`[Dispatch:${runId}] Done. ${dispatched} order(s) dispatched.`);
      } catch (err) {
        console.error(`[Dispatch:${runId}] Unexpected error:`, (err as Error).message);
      }
    });
  }
}

