/**
 * MandiKart — UserApp Bulk Requirements Controller
 * Allows commercial buyers (Hotels, Institutions, Wholesalers) to post large-scale demand
 * and discover AI-matched farmers and FPO clusters.
 */

import { Request, Response } from 'express';
import { UserRole } from '@mandikart/shared-types';
import { auditLog } from '@mandikart/shared-core';

interface BulkRequirement {
  id: string;
  buyerId: string;
  cropName: string;
  grade: 'A' | 'B' | 'C';
  requiredQuantity: number;
  quantityUnit: 'kg' | 'quintal' | 'tonne';
  maxTargetPricePerUnit: number;
  deliveryLocation: string;
  requiredByDate: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';
  matchedSupplierCount: number;
  createdAt: string;
}

const mockBulkRequirements: BulkRequirement[] = [
  {
    id: 'breq_101',
    buyerId: 'buyer_default_01',
    cropName: 'Red Onion',
    grade: 'A',
    requiredQuantity: 25,
    quantityUnit: 'quintal',
    maxTargetPricePerUnit: 2400,
    deliveryLocation: 'Pune Central Warehouse, Shivajinagar',
    requiredByDate: '2026-09-12',
    status: 'MATCHED',
    matchedSupplierCount: 3,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export class BulkRequirementsController {
  static async listRequirements(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const items = mockBulkRequirements.filter((r) => r.buyerId === buyerId);

    res.status(200).json({
      data: items,
      meta: { total: items.length },
      error: null,
    });
  }

  static async createRequirement(req: Request, res: Response): Promise<void> {
    const buyerId = req.user?.id || 'buyer_default_01';
    const { cropName, grade, requiredQuantity, quantityUnit, maxTargetPricePerUnit, deliveryLocation, requiredByDate } = req.body;

    if (!cropName || !requiredQuantity || !maxTargetPricePerUnit || !requiredByDate) {
      res.status(400).json({
        data: null,
        meta: null,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required fields for bulk commercial demand.' },
      });
      return;
    }

    const newReq: BulkRequirement = {
      id: `breq_${Date.now()}`,
      buyerId,
      cropName,
      grade: grade || 'A',
      requiredQuantity: Number(requiredQuantity),
      quantityUnit: quantityUnit || 'quintal',
      maxTargetPricePerUnit: Number(maxTargetPricePerUnit),
      deliveryLocation: deliveryLocation || 'Pune Wholesale Mandi',
      requiredByDate,
      status: 'MATCHED',
      matchedSupplierCount: 2,
      createdAt: new Date().toISOString(),
    };

    mockBulkRequirements.unshift(newReq);

    await auditLog({
      actorId: buyerId,
      role: UserRole.BUYER,
      action: 'CREATE_BULK_REQUIREMENT',
      resourceType: 'PRODUCT',
      resourceId: newReq.id,
      metadata: { cropName, requiredQuantity, quantityUnit },
    });

    res.status(201).json({
      data: newReq,
      meta: null,
      error: null,
    });
  }

  static async getMatches(req: Request, res: Response): Promise<void> {
    const reqId = String(req.params.id);
    const requirement = mockBulkRequirements.find((r) => r.id === reqId);

    // AI-driven matching algorithm output
    const matches = [
      {
        supplierId: 'farmer_ramesh_01',
        supplierName: 'Ramesh Patil (Nashik Kisan FPO)',
        type: 'FPO_CLUSTER',
        cropName: requirement ? requirement.cropName : 'Red Onion',
        grade: 'A',
        availableCapacity: 40,
        capacityUnit: requirement?.quantityUnit || 'quintal',
        askingPricePerUnit: requirement ? requirement.maxTargetPricePerUnit * 0.98 : 2350,
        distanceKm: 42,
        aiMatchScore: 96,
        isVerified: true,
        fulfillmentPurity: '99.2%',
        location: 'Niphad, Nashik',
      },
      {
        supplierId: 'farmer_priya_02',
        supplierName: 'Priya Devi Organics',
        type: 'FARMER',
        cropName: requirement ? requirement.cropName : 'Red Onion',
        grade: 'A',
        availableCapacity: 15,
        capacityUnit: requirement?.quantityUnit || 'quintal',
        askingPricePerUnit: requirement ? requirement.maxTargetPricePerUnit * 1.02 : 2450,
        distanceKm: 85,
        aiMatchScore: 89,
        isVerified: true,
        fulfillmentPurity: '98.5%',
        location: 'Satara Agri Cluster',
      },
    ];

    res.status(200).json({
      data: {
        requirementId: reqId,
        requirement,
        matches,
      },
      meta: { total: matches.length },
      error: null,
    });
  }
}
