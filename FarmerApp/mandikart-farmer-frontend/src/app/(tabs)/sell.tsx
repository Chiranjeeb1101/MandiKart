/**
 * MandiKart Farmer App — Sell Home (Screen 01)
 *
 * The farmer's complete selling marketplace, market intelligence,
 * buyer discovery, and sales management center.
 *
 * Section Priority (per specification):
 * 1. Header + Quick Actions
 * 2. Sell My Produce ("Sell Your Fasal")
 * 3. New Buyer Requests Spotlight
 * 4. Best Selling Opportunity Spotlight
 * 5. Market Today (AGMARKNET verified low/high/ref rates)
 * 6. Buyer Demand ("Buyers Looking For")
 * 7. My Active Sales
 * 8. Recent Sales
 *
 * Simple, professional English throughout.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Tag,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Truck,
  IndianRupee,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ArrowRight,
  BarChart3,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Plus,
  Scale,
  Building2,
  Lock,
  PackageCheck,
  Percent,
  X,
  SlidersHorizontal,
} from 'lucide-react-native';
import { MKColors } from '@/constants/colors';
import { useProduceStore, CropItem } from '@/store/produceStore';
import { useSellStore, BuyerRequest, CompletedSale } from '@/store/sellStore';

export default function SellHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Stores
  const crops = useProduceStore((state) => state.crops);
  const requests = useSellStore((state) => state.requests);
  const salesHistory = useSellStore((state) => state.salesHistory);
  const createListing = useSellStore((state) => state.createListing);
  const acceptRequest = useSellStore((state) => state.acceptRequest);
  const rejectRequest = useSellStore((state) => state.rejectRequest);
  const counterOffer = useSellStore((state) => state.counterOffer);

  // Active new / pending requests
  const newRequests = useMemo(() => {
    return requests.filter((r) => r.status === 'New' || r.status === 'Pending');
  }, [requests]);

  const activeSales = useMemo(() => {
    return salesHistory.filter((s) => s.status === 'In Transit' || s.status === 'Payment Pending');
  }, [salesHistory]);

  // Modals state
  const [selectedCropForSell, setSelectedCropForSell] = useState<CropItem | null>(null);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [sellQuantityInput, setSellQuantityInput] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);

  // Listing modal
  const [listingModalVisible, setListingModalVisible] = useState(false);
  const [listingCrop, setListingCrop] = useState<CropItem | null>(null);
  const [listingTargetPrice, setListingTargetPrice] = useState('');
  const [listingNotes, setListingNotes] = useState('');

  // Counter offer modal
  const [counterModalVisible, setCounterModalVisible] = useState(false);
  const [selectedRequestForCounter, setSelectedRequestForCounter] = useState<BuyerRequest | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [counterMessageInput, setCounterMessageInput] = useState('');

  // Open quantity modal
  const handleOpenSellModal = (crop: CropItem) => {
    setSelectedCropForSell(crop);
    setSellQuantityInput(crop.availableKg.toString());
    setSelectedPercentage(100);
    setSellModalVisible(true);
  };

  const handleSetPercentage = (pct: number) => {
    if (!selectedCropForSell) return;
    setSelectedPercentage(pct);
    const calculatedQty = Math.round((selectedCropForSell.availableKg * pct) / 100);
    setSellQuantityInput(calculatedQty.toString());
  };

  const handleProceedToBestOptions = () => {
    if (!selectedCropForSell) return;
    const qty = parseFloat(sellQuantityInput);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity to sell.');
      return;
    }
    if (qty > selectedCropForSell.availableKg) {
      Alert.alert(
        'Exceeds Available Stock',
        `You have ${selectedCropForSell.availableKg.toLocaleString()} kg available. Please enter an amount equal to or less than your available stock.`
      );
      return;
    }

    setSellModalVisible(false);
    router.push({
      pathname: '/sell/best-options',
      params: {
        crop: selectedCropForSell.cropName,
        qty: qty.toString(),
        grade: selectedCropForSell.grade,
      },
    });
  };

  // Listing Handler
  const handleOpenListingModal = (crop: CropItem) => {
    setListingCrop(crop);
    setListingTargetPrice(crop.referencePricePerKg ? (crop.referencePricePerKg + 2).toString() : '25');
    setListingNotes('');
    setListingModalVisible(true);
  };

  const handleCreateListing = () => {
    if (!listingCrop) return;
    const targetPrice = parseFloat(listingTargetPrice) || listingCrop.referencePricePerKg;

    createListing({
      cropId: listingCrop.id,
      cropName: listingCrop.cropName,
      variety: listingCrop.variety,
      totalKg: listingCrop.availableKg,
      availableKg: listingCrop.availableKg,
      grade: listingCrop.grade,
      targetPricePerKg: targetPrice,
      availableFrom: 'Immediate',
      pickupLocation: listingCrop.location || 'Main Farm Warehouse',
      notes: listingNotes || 'Clean harvested crop ready for buyer inspection.',
      status: 'Available',
    });

    setListingModalVisible(false);
    Alert.alert(
      'Listing Published',
      `Your ${listingCrop.cropName} (${listingCrop.availableKg.toLocaleString()} kg) is now discoverable by verified buyers in the marketplace.`
    );
  };

  // Quick Accept Request
  const handleAcceptRequest = (req: BuyerRequest) => {
    Alert.alert(
      'Accept Buyer Offer?',
      `Confirm acceptance of ${req.buyerName}'s offer for ${req.quantityKg.toLocaleString()} kg of ${req.cropName} at ₹${req.offerPricePerKg}/kg?\n\nEstimated Net Return: ₹${req.estimatedNetReturnPerKg}/kg\nGross Value: ₹${(req.quantityKg * req.offerPricePerKg).toLocaleString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept Offer',
          style: 'default',
          onPress: () => {
            const res = acceptRequest(req.id);
            if (res.success) {
              Alert.alert(
                'Sale Confirmed!',
                `Your order (${res.orderId}) has been created. The vehicle pickup and logistics tracking are now active in the Orders module.`,
                [
                  {
                    text: 'View in Orders',
                    onPress: () => router.push('/(tabs)/orders'),
                  },
                  { text: 'Stay in Sell', style: 'cancel' },
                ]
              );
            } else {
              Alert.alert('Unable to Accept', res.error || 'Please check available stock.');
            }
          },
        },
      ]
    );
  };

  // Open Counter Modal
  const handleOpenCounterModal = (req: BuyerRequest) => {
    setSelectedRequestForCounter(req);
    setCounterPriceInput((req.offerPricePerKg + 1.5).toString());
    setCounterMessageInput('');
    setCounterModalVisible(true);
  };

  const handleSendCounter = () => {
    if (!selectedRequestForCounter) return;
    const price = parseFloat(counterPriceInput);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid counter price per kg.');
      return;
    }

    counterOffer(
      selectedRequestForCounter.id,
      price,
      selectedRequestForCounter.quantityKg,
      counterMessageInput.trim() || undefined
    );

    setCounterModalVisible(false);
    Alert.alert('Counter Offer Sent', `Your counter offer of ₹${price}/kg has been submitted to ${selectedRequestForCounter.buyerName}.`);
  };

  // Quick Reject Request
  const handleRejectRequest = (req: BuyerRequest) => {
    Alert.alert(
      'Decline Request',
      `Are you sure you want to decline this offer from ${req.buyerName}?`,
      [
        { text: 'Back', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => rejectRequest(req.id, 'Price not aligned with farmer target'),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Header ────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerSubtitle}>MandiKart Marketplace</Text>
          <Text style={styles.headerTitle}>Sell</Text>
          <Text style={styles.headerCaption}>
            Find buyers, check prices and sell your crop
          </Text>
        </View>
        <Pressable
          style={styles.headerIconBtn}
          onPress={() => router.push('/sell/requests')}
          accessibilityLabel="Buyer Requests"
        >
          <ShoppingBag size={20} color={MKColors.textPrimary} />
          {newRequests.length > 0 && (
            <View style={styles.requestBadgeDot}>
              <Text style={styles.requestBadgeText}>{newRequests.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Quick Action Bar (4 Key Actions) ──────────────────────── */}
        <View style={styles.quickActionsBar}>
          <Pressable
            style={styles.quickActionItem}
            onPress={() => {
              if (crops.length > 0) handleOpenSellModal(crops[0]);
              else router.push('/produce/add');
            }}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <Tag size={18} color={MKColors.primaryGreen} />
            </View>
            <Text style={styles.quickActionText}>Sell My Crop</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionItem}
            onPress={() => router.push('/sell/requests')}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: '#FFF3E0' }]}>
              <Users size={18} color={MKColors.accentOrange} />
              {newRequests.length > 0 && <View style={styles.miniDot} />}
            </View>
            <Text style={styles.quickActionText}>Buyer Requests</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionItem}
            onPress={() => router.push('/sell/market')}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <TrendingUp size={18} color={MKColors.primaryGreenDark} />
            </View>
            <Text style={styles.quickActionText}>Market Prices</Text>
          </Pressable>

          <Pressable
            style={styles.quickActionItem}
            onPress={() => router.push('/sell/history')}
          >
            <View style={[styles.quickActionIconWrap, { backgroundColor: '#F1F5F9' }]}>
              <BarChart3 size={18} color="#0284C7" />
            </View>
            <Text style={styles.quickActionText}>My Sales</Text>
          </Pressable>
        </View>

        {/* ── Priority 1: Sell Your Fasal ──────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Sell Your Fasal</Text>
            <Text style={styles.sectionSubtitle}>Choose a crop you have available</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/produce')}>
            <Text style={styles.sectionActionLink}>My Inventory →</Text>
          </Pressable>
        </View>

        {crops.length === 0 ? (
          <View style={styles.emptyCard}>
            <PackageCheck size={36} color={MKColors.textSecondary} />
            <Text style={styles.emptyTitle}>No crops found in your inventory</Text>
            <Text style={styles.emptySubtitle}>
              Add your harvest to start receiving buyer offers and checking mandi benchmarks.
            </Text>
            <Pressable
              style={styles.emptyAddBtn}
              onPress={() => router.push('/produce/add')}
            >
              <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyAddBtnText}>Add Crop to Inventory</Text>
            </Pressable>
          </View>
        ) : (
          crops.map((crop) => {
            const isAvailable = crop.availableKg > 0;
            return (
              <View key={crop.id} style={styles.produceSellCard}>
                <View style={styles.produceTopRow}>
                  <Image source={{ uri: crop.imageUri }} style={styles.produceThumb} />
                  <View style={styles.produceMetaCol}>
                    <View style={styles.produceTitleBadgeRow}>
                      <Text style={styles.produceName} numberOfLines={1}>
                        {crop.cropName}
                      </Text>
                      <View style={styles.gradePill}>
                        <Text style={styles.gradePillText}>{crop.grade}</Text>
                      </View>
                    </View>
                    <Text style={styles.produceSubtext}>
                      {crop.variety || crop.category} • Harvested: {crop.harvestDate}
                    </Text>

                    <View style={styles.stockQuantityPill}>
                      <Scale size={13} color={MKColors.primaryGreenDark} />
                      <Text style={styles.stockQuantityText}>
                        <Text style={{ fontWeight: '800' }}>{crop.availableKg.toLocaleString()} kg</Text> available
                        {crop.reservedKg > 0 ? ` (${crop.reservedKg} kg reserved)` : ''}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Market Benchmark row */}
                <View style={styles.marketPriceStrip}>
                  <View style={styles.mandiRefPill}>
                    <Building2 size={13} color={MKColors.textSecondary} />
                    <Text style={styles.mandiRefText}>
                      Ref Price: <Text style={styles.mandiRefBold}>₹{crop.referencePricePerKg}/kg</Text>
                    </Text>
                  </View>

                  <View style={styles.demandTrendRow}>
                    <Text style={styles.demandLabel}>
                      Demand: <Text style={{ fontWeight: '700', color: MKColors.primaryGreenDark }}>{crop.marketDemand}</Text>
                    </Text>
                    {crop.priceMovementPct !== 0 && (
                      <View
                        style={[
                          styles.trendChip,
                          crop.priceMovementTrend === 'up' ? styles.trendChipUp : styles.trendChipDown,
                        ]}
                      >
                        {crop.priceMovementTrend === 'up' ? (
                          <TrendingUp size={11} color={MKColors.primaryGreen} />
                        ) : (
                          <TrendingDown size={11} color="#DC2626" />
                        )}
                        <Text
                          style={[
                            styles.trendChipText,
                            crop.priceMovementTrend === 'up'
                              ? { color: MKColors.primaryGreen }
                              : { color: '#DC2626' },
                          ]}
                        >
                          {crop.priceMovementPct > 0 ? `+${crop.priceMovementPct}%` : `${crop.priceMovementPct}%`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Action Row */}
                <View style={styles.cardActionsRow}>
                  <Pressable
                    style={styles.listForSaleBtn}
                    onPress={() => handleOpenListingModal(crop)}
                  >
                    <Text style={styles.listForSaleBtnText}>List for Sale</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.sellThisCropBtn, !isAvailable && styles.btnDisabled]}
                    disabled={!isAvailable}
                    onPress={() => handleOpenSellModal(crop)}
                  >
                    <Text style={styles.sellThisCropBtnText}>Sell This Crop</Text>
                    <ArrowRight size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* ── Priority 2: New Buyer Requests Spotlight ─────────────── */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>New Buyer Requests</Text>
            {newRequests.length > 0 && (
              <View style={styles.sectionCountPill}>
                <Text style={styles.sectionCountPillText}>{newRequests.length} new</Text>
              </View>
            )}
          </View>
          <Pressable onPress={() => router.push('/sell/requests')}>
            <Text style={styles.sectionActionLink}>View All ({requests.length}) →</Text>
          </Pressable>
        </View>

        {newRequests.length === 0 ? (
          <View style={styles.simpleNoticeBox}>
            <CheckCircle2 size={18} color={MKColors.primaryGreen} style={{ marginRight: 8 }} />
            <Text style={styles.simpleNoticeText}>
              No pending buyer requests. New requests from active buyers will appear here.
            </Text>
          </View>
        ) : (
          newRequests.slice(0, 2).map((req) => (
            <View key={req.id} style={styles.requestSpotlightCard}>
              <View style={styles.requestCardHeader}>
                <Image source={{ uri: req.avatar }} style={styles.buyerAvatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.buyerNameText} numberOfLines={1}>
                      {req.buyerName}
                    </Text>
                    {req.verified && (
                      <ShieldCheck size={14} color={MKColors.primaryGreen} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <Text style={styles.requestSubtitle}>
                    Wants your {req.cropName} • {req.buyerType}
                  </Text>
                </View>
                <View style={styles.expiryBadge}>
                  <Clock size={11} color="#B45309" />
                  <Text style={styles.expiryText}>{req.expiresInHours}h left</Text>
                </View>
              </View>

              {/* Requirement Strip */}
              <View style={styles.requestStatsGrid}>
                <View style={styles.requestStatCol}>
                  <Text style={styles.statSublabel}>Quantity</Text>
                  <Text style={styles.statBoldValue}>{req.quantityKg.toLocaleString()} kg</Text>
                  <Text style={styles.statSmallMeta}>({req.qualityGrade})</Text>
                </View>

                <View style={styles.requestStatCol}>
                  <Text style={styles.statSublabel}>Offer Rate</Text>
                  <Text style={[styles.statBoldValue, { color: MKColors.primaryGreenDark }]}>
                    ₹{req.offerPricePerKg}/kg
                  </Text>
                  <Text style={styles.statSmallMeta}>Ref: ₹{req.marketReferencePricePerKg}/kg</Text>
                </View>

                <View style={styles.requestStatCol}>
                  <Text style={styles.statSublabel}>Est. Net Return</Text>
                  <Text style={[styles.statBoldValue, { color: MKColors.accentOrangeDark }]}>
                    ₹{req.estimatedNetReturnPerKg}/kg
                  </Text>
                  <Text style={styles.statSmallMeta}>Transit: ~₹{req.estimatedTransportPerKg}/kg</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.requestActionRow}>
                <Pressable
                  style={styles.requestRejectBtn}
                  onPress={() => handleRejectRequest(req)}
                >
                  <Text style={styles.requestRejectText}>Decline</Text>
                </Pressable>

                <Pressable
                  style={styles.requestCounterBtn}
                  onPress={() => handleOpenCounterModal(req)}
                >
                  <Text style={styles.requestCounterText}>Counter</Text>
                </Pressable>

                <Pressable
                  style={styles.requestAcceptBtn}
                  onPress={() => handleAcceptRequest(req)}
                >
                  <Text style={styles.requestAcceptText}>Accept Offer</Text>
                  <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                </Pressable>
              </View>
            </View>
          ))
        )}

        {/* ── Priority 3: Best Selling Opportunity Spotlight ───────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Best Selling Opportunity</Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/sell/best-options',
                params: { crop: crops[0]?.cropName || 'Onion', qty: '1000', grade: 'Grade A' },
              })
            }
          >
            <Text style={styles.sectionActionLink}>Compare All →</Text>
          </Pressable>
        </View>

        <View style={styles.bestOpportunityCard}>
          <View style={styles.recommendedBadgeRow}>
            <View style={styles.starPill}>
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.starPillText}>⭐ Recommended Option</Text>
            </View>
            <View style={styles.matchScoreBadge}>
              <Text style={styles.matchScoreText}>94% Match</Text>
            </View>
          </View>

          <View style={styles.oppBuyerRow}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
              }}
              style={styles.oppBuyerAvatar}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.oppBuyerName}>ABC Foods & Agro Procurements</Text>
                <ShieldCheck size={14} color={MKColors.primaryGreen} style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.oppBuyerMeta}>
                📍 40 km away • 1,240+ verified deals • Prompt farmgate pickup
              </Text>
            </View>
          </View>

          {/* Pricing spotlight: Gross vs Transport vs Estimated Net */}
          <View style={styles.netReturnBanner}>
            <View style={styles.netReturnCol}>
              <Text style={styles.netReturnBannerLabel}>Buyer Offer:</Text>
              <Text style={styles.netReturnBannerValue}>₹25.00 / kg</Text>
              <Text style={styles.netReturnBannerSub}>Market Ref: ₹22.00/kg</Text>
            </View>

            <View style={styles.netReturnDivider} />

            <View style={styles.netReturnCol}>
              <Text style={styles.netReturnBannerLabel}>Est. Transport:</Text>
              <Text style={styles.netReturnBannerValue}>− ₹1.50 / kg</Text>
              <Text style={styles.netReturnBannerSub}>Distance: 40 km</Text>
            </View>

            <View style={styles.netReturnDivider} />

            <View style={styles.netReturnCol}>
              <Text style={[styles.netReturnBannerLabel, { color: MKColors.primaryGreenDark }]}>
                Est. Net Return:
              </Text>
              <Text style={[styles.netReturnBannerValue, { color: MKColors.primaryGreenDark, fontSize: 18 }]}>
                ₹23.50 / kg
              </Text>
              <Text style={styles.netReturnBannerSub}>Direct to Bank</Text>
            </View>
          </View>

          <Text style={styles.oppReasonText}>
            💡 <Text style={{ fontWeight: '700' }}>Why this option:</Text> Your quantity and Grade A quality match this buyer's requirement, and the estimated transport cost is relatively low.
          </Text>

          <Pressable
            style={styles.viewBestOptionsBtn}
            onPress={() =>
              router.push({
                pathname: '/sell/best-options',
                params: {
                  crop: crops[0]?.cropName || 'Red Onion',
                  qty: '1000',
                  grade: 'Grade A',
                },
              })
            }
          >
            <Text style={styles.viewBestOptionsBtnText}>View Best Options & Compare</Text>
            <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </Pressable>
        </View>

        {/* ── Priority 4: Market Today ─────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Market Today</Text>
            <Text style={styles.sectionSubtitle}>AGMARKNET official mandi benchmark prices</Text>
          </View>
          <Pressable onPress={() => router.push('/sell/market')}>
            <Text style={styles.sectionActionLink}>Full Market →</Text>
          </Pressable>
        </View>

        <View style={styles.marketCardsGrid}>
          {/* Onion */}
          <View style={styles.marketPriceCard}>
            <View style={styles.marketCardTop}>
              <Text style={styles.marketCropName}>Red Onion</Text>
              <View style={[styles.trendChip, styles.trendChipUp]}>
                <TrendingUp size={11} color={MKColors.primaryGreen} />
                <Text style={[styles.trendChipText, { color: MKColors.primaryGreen }]}>+8%</Text>
              </View>
            </View>

            <View style={styles.marketMainRateRow}>
              <Text style={styles.marketCurrentRate}>₹22.00</Text>
              <Text style={styles.marketPerKg}> / kg</Text>
            </View>

            <View style={styles.rangeRow}>
              <Text style={styles.rangeText}>Low: ₹19.00</Text>
              <Text style={styles.rangeDot}>•</Text>
              <Text style={styles.rangeText}>High: ₹25.00</Text>
            </View>

            <View style={styles.marketFooterRow}>
              <Text style={styles.marketMandiName}>Nashik APMC (AGMARKNET)</Text>
              <Text style={styles.marketTimeText}>10:30 AM</Text>
            </View>
          </View>

          {/* Tomato */}
          <View style={styles.marketPriceCard}>
            <View style={styles.marketCardTop}>
              <Text style={styles.marketCropName}>Tomato</Text>
              <View style={[styles.trendChip, styles.trendChipDown]}>
                <TrendingDown size={11} color="#DC2626" />
                <Text style={[styles.trendChipText, { color: '#DC2626' }]}>-5%</Text>
              </View>
            </View>

            <View style={styles.marketMainRateRow}>
              <Text style={styles.marketCurrentRate}>₹18.00</Text>
              <Text style={styles.marketPerKg}> / kg</Text>
            </View>

            <View style={styles.rangeRow}>
              <Text style={styles.rangeText}>Low: ₹15.00</Text>
              <Text style={styles.rangeDot}>•</Text>
              <Text style={styles.rangeText}>High: ₹22.00</Text>
            </View>

            <View style={styles.marketFooterRow}>
              <Text style={styles.marketMandiName}>Pimpalgaon (AGMARKNET)</Text>
              <Text style={styles.marketTimeText}>10:30 AM</Text>
            </View>
          </View>
        </View>

        {/* ── Priority 5: Buyer Demand ("Buyers Looking For") ──────── */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Buyers Looking For</Text>
            <Text style={styles.sectionSubtitle}>Verified aggregate buyer procurement demand</Text>
          </View>
          <Pressable onPress={() => router.push('/sell/best-options')}>
            <Text style={styles.sectionActionLink}>View Matches →</Text>
          </Pressable>
        </View>

        <View style={styles.demandCardsContainer}>
          <View style={styles.demandRowCard}>
            <View style={styles.demandCropBadge}>
              <Text style={styles.demandCropText}>Red Onion</Text>
            </View>
            <View style={styles.demandDetailsCol}>
              <Text style={styles.demandVolumeText}>
                <Text style={{ fontWeight: '800' }}>8 buyers</Text> looking • 12,500 kg total needed
              </Text>
              <Text style={styles.demandCriteriaText}>
                Grade A / B • Pickup: This week • Average offer: ₹24–25.50/kg
              </Text>
            </View>
            <ChevronRight size={18} color={MKColors.textSecondary} />
          </View>

          <View style={styles.demandRowCard}>
            <View style={styles.demandCropBadge}>
              <Text style={styles.demandCropText}>Tomato</Text>
            </View>
            <View style={styles.demandDetailsCol}>
              <Text style={styles.demandVolumeText}>
                <Text style={{ fontWeight: '800' }}>5 buyers</Text> looking • 4,200 kg total needed
              </Text>
              <Text style={styles.demandCriteriaText}>
                Semi-ripe • Immediate collection • Average offer: ₹19–21/kg
              </Text>
            </View>
            <ChevronRight size={18} color={MKColors.textSecondary} />
          </View>
        </View>

        {/* ── Priority 6: My Active Sales ──────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Active Sales</Text>
          <Pressable onPress={() => router.push('/sell/history')}>
            <Text style={styles.sectionActionLink}>View All →</Text>
          </Pressable>
        </View>

        {activeSales.length === 0 ? (
          <View style={styles.simpleNoticeBox}>
            <Clock size={16} color={MKColors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={styles.simpleNoticeText}>
              No orders currently in transit. Accepted deals will show live progress here.
            </Text>
          </View>
        ) : (
          activeSales.map((sale) => (
            <View key={sale.id} style={styles.activeSaleCard}>
              <View style={styles.activeSaleHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activeSaleCrop}>
                    {sale.cropName} ({sale.quantityKg.toLocaleString()} kg)
                  </Text>
                  <Text style={styles.activeSaleBuyer}>
                    Buyer: {sale.buyerName}
                  </Text>
                </View>
                <View style={styles.activeStatusPill}>
                  <Text style={styles.activeStatusText}>{sale.status}</Text>
                </View>
              </View>

              <View style={styles.activeSaleBottom}>
                <Text style={styles.activeSalePayout}>
                  Est. Net Payout: <Text style={{ fontWeight: '800' }}>₹{sale.netPayout.toLocaleString()}</Text>
                </Text>
                <Pressable
                  style={styles.viewOrderLink}
                  onPress={() => router.push('/(tabs)/orders')}
                >
                  <Text style={styles.viewOrderLinkText}>Track in Orders →</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        {/* ── Priority 7: Recent Sales History Strip ───────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          <Pressable onPress={() => router.push('/sell/history')}>
            <Text style={styles.sectionActionLink}>Full History →</Text>
          </Pressable>
        </View>

        <View style={styles.recentSalesStrip}>
          {salesHistory.slice(0, 2).map((sale) => (
            <Pressable
              key={sale.id}
              style={styles.recentSaleRow}
              onPress={() => router.push('/sell/history')}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.recentSaleCrop}>{sale.cropName} • {sale.quantityKg.toLocaleString()} kg</Text>
                <Text style={styles.recentSaleMeta}>Sold to {sale.buyerName} on {sale.saleDate}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.recentSaleAmount}>₹{sale.netPayout.toLocaleString()}</Text>
                <Text style={styles.recentSaleStatus}>{sale.status}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal: Select Quantity to Sell ───────────────────────── */}
      <Modal
        visible={sellModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSellModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>How much do you want to sell?</Text>
              <Pressable onPress={() => setSellModalVisible(false)} hitSlop={10}>
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalCropSub}>
              {selectedCropForSell?.cropName} ({selectedCropForSell?.grade})
            </Text>

            <View style={styles.availableNotice}>
              <Scale size={14} color={MKColors.primaryGreenDark} />
              <Text style={styles.availableNoticeText}>
                Available to sell: <Text style={{ fontWeight: '800' }}>{selectedCropForSell?.availableKg.toLocaleString()} kg</Text>
              </Text>
            </View>

            {/* Quick % chips */}
            <View style={styles.percentageChipsRow}>
              {[25, 50, 75, 100].map((pct) => {
                const isSelected = selectedPercentage === pct;
                return (
                  <Pressable
                    key={pct}
                    style={[styles.percentChip, isSelected && styles.percentChipActive]}
                    onPress={() => handleSetPercentage(pct)}
                  >
                    <Text style={[styles.percentChipText, isSelected && styles.percentChipTextActive]}>
                      {pct}%
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.quantityInputBox}>
              <TextInput
                style={styles.quantityInputText}
                keyboardType="numeric"
                value={sellQuantityInput}
                onChangeText={(val) => {
                  setSellQuantityInput(val);
                  setSelectedPercentage(null);
                }}
                placeholder="Enter kg"
                placeholderTextColor={MKColors.textMuted}
              />
              <Text style={styles.quantityUnitLabel}>KG</Text>
            </View>

            {selectedCropForSell && (
              <View style={styles.estReturnBox}>
                <Text style={styles.estReturnLabel}>Estimated Benchmark Value:</Text>
                <Text style={styles.estReturnValue}>
                  ₹{(
                    (parseFloat(sellQuantityInput) || 0) *
                    (selectedCropForSell.referencePricePerKg || 22)
                  ).toLocaleString()}{' '}
                  <Text style={styles.estReturnSub}>
                    (@ ₹{selectedCropForSell.referencePricePerKg}/kg AGMARKNET ref)
                  </Text>
                </Text>
                <Text style={styles.estReturnDisclaimer}>
                  Actual net payout will depend on buyer match and transport quote.
                </Text>
              </View>
            )}

            <Pressable
              style={styles.modalPrimaryBtn}
              onPress={handleProceedToBestOptions}
            >
              <Text style={styles.modalPrimaryBtnText}>Find Best Selling Options</Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Create Selling Listing ────────────────────────── */}
      <Modal
        visible={listingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setListingModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Put Crop Up for Sale</Text>
              <Pressable onPress={() => setListingModalVisible(false)} hitSlop={10}>
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalCropSub}>
              Make your {listingCrop?.cropName} discoverable to all verified buyers.
            </Text>

            <View style={styles.listingSummaryRow}>
              <Text style={styles.listingFieldLabel}>Quantity available:</Text>
              <Text style={styles.listingFieldBold}>{listingCrop?.availableKg.toLocaleString()} kg ({listingCrop?.grade})</Text>
            </View>

            <View style={styles.listingInputWrap}>
              <Text style={styles.listingFieldLabel}>Your Target Price (₹ per kg):</Text>
              <TextInput
                style={styles.listingTextInput}
                keyboardType="numeric"
                value={listingTargetPrice}
                onChangeText={setListingTargetPrice}
                placeholder="e.g. 24"
                placeholderTextColor={MKColors.textMuted}
              />
            </View>

            <View style={styles.listingInputWrap}>
              <Text style={styles.listingFieldLabel}>Pickup Preference / Notes:</Text>
              <TextInput
                style={[styles.listingTextInput, { height: 60, textAlignVertical: 'top' }]}
                value={listingNotes}
                onChangeText={setListingNotes}
                placeholder="e.g. Farmgate collection preferred, dry warehouse stored."
                placeholderTextColor={MKColors.textMuted}
                multiline
              />
            </View>

            <Pressable
              style={styles.modalPrimaryBtn}
              onPress={handleCreateListing}
            >
              <Text style={styles.modalPrimaryBtnText}>LIST FOR SALE</Text>
              <CheckCircle2 size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Counter Offer ─────────────────────────────────── */}
      <Modal
        visible={counterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCounterModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Send Counter Offer</Text>
              <Pressable onPress={() => setCounterModalVisible(false)} hitSlop={10}>
                <X size={20} color={MKColors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalCropSub}>
              Negotiating with {selectedRequestForCounter?.buyerName}
            </Text>

            <View style={styles.counterCompareStrip}>
              <View style={styles.counterCompareCol}>
                <Text style={styles.counterCompareLabel}>Current Offer</Text>
                <Text style={styles.counterCompareVal}>
                  ₹{selectedRequestForCounter?.offerPricePerKg}/kg
                </Text>
              </View>
              <View style={styles.counterDivider} />
              <View style={styles.counterCompareCol}>
                <Text style={styles.counterCompareLabel}>Quantity</Text>
                <Text style={styles.counterCompareVal}>
                  {selectedRequestForCounter?.quantityKg} kg
                </Text>
              </View>
            </View>

            <View style={styles.listingInputWrap}>
              <Text style={styles.listingFieldLabel}>Your Proposed Price (₹ per kg):</Text>
              <TextInput
                style={styles.listingTextInput}
                keyboardType="numeric"
                value={counterPriceInput}
                onChangeText={setCounterPriceInput}
                placeholder="e.g. 25.5"
                placeholderTextColor={MKColors.textMuted}
              />
            </View>

            <View style={styles.listingInputWrap}>
              <Text style={styles.listingFieldLabel}>Message to Buyer (Optional):</Text>
              <TextInput
                style={[styles.listingTextInput, { height: 50 }]}
                value={counterMessageInput}
                onChangeText={setCounterMessageInput}
                placeholder="e.g. Premium Grade A sorted produce, ready for immediate loading."
                placeholderTextColor={MKColors.textMuted}
              />
            </View>

            <Pressable
              style={styles.modalPrimaryBtn}
              onPress={handleSendCounter}
            >
              <Text style={styles.modalPrimaryBtnText}>SEND COUNTER OFFER</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MKColors.backgroundPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MKColors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  headerCaption: {
    fontSize: 12,
    color: MKColors.textSecondary,
    marginTop: 1,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MKColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  requestBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  requestBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── Quick Actions Bar ─────────────────────────────────────────────
  quickActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: MKColors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  miniDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.textPrimary,
    textAlign: 'center',
  },

  // ── Section Headers ───────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 1,
  },
  sectionActionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
  sectionCountPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  sectionCountPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },

  // ── Produce Sell Card ─────────────────────────────────────────────
  produceSellCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MKColors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  produceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  produceThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  produceMetaCol: {
    flex: 1,
  },
  produceTitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  produceName: {
    fontSize: 16,
    fontWeight: '800',
    color: MKColors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  gradePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
  produceSubtext: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginVertical: 2,
  },
  stockQuantityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 2,
    gap: 4,
  },
  stockQuantityText: {
    fontSize: 11,
    color: MKColors.textPrimary,
  },

  marketPriceStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  mandiRefPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mandiRefText: {
    fontSize: 11,
    color: MKColors.textSecondary,
  },
  mandiRefBold: {
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  demandTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demandLabel: {
    fontSize: 11,
    color: MKColors.textSecondary,
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendChipUp: {
    backgroundColor: '#E8F5E9',
  },
  trendChipDown: {
    backgroundColor: '#FEE2E2',
  },
  trendChipText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },

  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  listForSaleBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: MKColors.primaryGreen,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listForSaleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
  sellThisCropBtn: {
    flex: 1.3,
    height: 42,
    borderRadius: 10,
    backgroundColor: MKColors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellThisCropBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
  },

  // ── Request Spotlight Card ────────────────────────────────────────
  requestSpotlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: MKColors.accentOrangeMuted,
    elevation: 1,
  },
  requestCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buyerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
  },
  buyerNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  requestSubtitle: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 1,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  expiryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },

  requestStatsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  requestStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  statSublabel: {
    fontSize: 10,
    color: MKColors.textSecondary,
    marginBottom: 2,
  },
  statBoldValue: {
    fontSize: 13,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  statSmallMeta: {
    fontSize: 9,
    color: MKColors.textMuted,
    marginTop: 1,
  },

  requestActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  requestRejectBtn: {
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestRejectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  requestCounterBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: MKColors.accentOrange,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCounterText: {
    fontSize: 12,
    fontWeight: '800',
    color: MKColors.accentOrange,
  },
  requestAcceptBtn: {
    flex: 1.3,
    height: 38,
    borderRadius: 8,
    backgroundColor: MKColors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestAcceptText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── Best Opportunity Card ─────────────────────────────────────────
  bestOpportunityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: MKColors.primaryGreen,
    elevation: 2,
    shadowColor: MKColors.primaryGreen,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  recommendedBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MKColors.primaryGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  starPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  matchScoreBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchScoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: MKColors.primaryGreen,
  },

  oppBuyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  oppBuyerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  oppBuyerName: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  oppBuyerMeta: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 2,
  },

  netReturnBanner: {
    flexDirection: 'row',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: MKColors.border,
    marginBottom: 10,
  },
  netReturnCol: {
    flex: 1,
    alignItems: 'center',
  },
  netReturnDivider: {
    width: 1,
    backgroundColor: MKColors.borderLight,
  },
  netReturnBannerLabel: {
    fontSize: 10,
    color: MKColors.textSecondary,
  },
  netReturnBannerValue: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginVertical: 2,
  },
  netReturnBannerSub: {
    fontSize: 9,
    color: MKColors.textMuted,
  },
  oppReasonText: {
    fontSize: 11,
    color: MKColors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  viewBestOptionsBtn: {
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBestOptionsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── Market Cards Grid ─────────────────────────────────────────────
  marketCardsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  marketPriceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: MKColors.border,
  },
  marketCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  marketCropName: {
    fontSize: 13,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  marketMainRateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  marketCurrentRate: {
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  marketPerKg: {
    fontSize: 11,
    color: MKColors.textSecondary,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 10,
    color: MKColors.textSecondary,
  },
  rangeDot: {
    marginHorizontal: 3,
    color: MKColors.textMuted,
  },
  marketFooterRow: {
    borderTopWidth: 1,
    borderTopColor: MKColors.borderLight,
    paddingTop: 6,
  },
  marketMandiName: {
    fontSize: 9,
    color: MKColors.textSecondary,
    fontWeight: '600',
  },
  marketTimeText: {
    fontSize: 8,
    color: MKColors.textMuted,
    marginTop: 1,
  },

  // ── Buyer Demand Cards ────────────────────────────────────────────
  demandCardsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MKColors.border,
    padding: 4,
    marginBottom: 12,
  },
  demandRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  demandCropBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
    marginRight: 10,
  },
  demandCropText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  demandDetailsCol: {
    flex: 1,
  },
  demandVolumeText: {
    fontSize: 12,
    color: MKColors.textPrimary,
  },
  demandCriteriaText: {
    fontSize: 10,
    color: MKColors.textSecondary,
    marginTop: 2,
  },

  // ── Active Sales ──────────────────────────────────────────────────
  activeSaleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: MKColors.border,
  },
  activeSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activeSaleCrop: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  activeSaleBuyer: {
    fontSize: 11,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  activeStatusPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  activeSaleBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: MKColors.borderLight,
    paddingTop: 8,
  },
  activeSalePayout: {
    fontSize: 12,
    color: MKColors.textPrimary,
  },
  viewOrderLink: {
    paddingVertical: 2,
  },
  viewOrderLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },

  // ── Recent Sales Strip ────────────────────────────────────────────
  recentSalesStrip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MKColors.border,
    padding: 6,
    marginBottom: 14,
  },
  recentSaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
  },
  recentSaleCrop: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  recentSaleMeta: {
    fontSize: 10,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  recentSaleAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.primaryGreenDark,
  },
  recentSaleStatus: {
    fontSize: 10,
    color: MKColors.textMuted,
    marginTop: 2,
  },

  // ── Notice Box & Empty States ─────────────────────────────────────
  simpleNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  simpleNoticeText: {
    flex: 1,
    fontSize: 11,
    color: MKColors.textSecondary,
    lineHeight: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MKColors.border,
    marginVertical: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: MKColors.textSecondary,
    textAlign: 'center',
    marginVertical: 6,
    lineHeight: 17,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MKColors.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Modals ────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  modalCropSub: {
    fontSize: 13,
    color: MKColors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  availableNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginBottom: 12,
  },
  availableNoticeText: {
    fontSize: 12,
    color: MKColors.primaryGreenDark,
  },
  percentageChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  percentChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MKColors.borderLight,
  },
  percentChipActive: {
    backgroundColor: MKColors.primaryGreen,
    borderColor: MKColors.primaryGreen,
  },
  percentChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.textSecondary,
  },
  percentChipTextActive: {
    color: '#FFFFFF',
  },
  quantityInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MKColors.border,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  quantityInputText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: MKColors.textPrimary,
  },
  quantityUnitLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: MKColors.textSecondary,
  },
  estReturnBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  estReturnLabel: {
    fontSize: 11,
    color: '#9A3412',
  },
  estReturnValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9A3412',
    marginVertical: 2,
  },
  estReturnSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#C2410C',
  },
  estReturnDisclaimer: {
    fontSize: 10,
    color: '#C2410C',
    marginTop: 2,
  },
  modalPrimaryBtn: {
    backgroundColor: MKColors.primaryGreen,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Listing fields
  listingSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: MKColors.borderLight,
    marginBottom: 12,
  },
  listingFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MKColors.textSecondary,
    marginBottom: 4,
  },
  listingFieldBold: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  listingInputWrap: {
    marginBottom: 12,
  },
  listingTextInput: {
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MKColors.border,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: MKColors.textPrimary,
  },

  // Counter
  counterCompareStrip: {
    flexDirection: 'row',
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: MKColors.borderLight,
    marginBottom: 12,
  },
  counterCompareCol: {
    flex: 1,
    alignItems: 'center',
  },
  counterDivider: {
    width: 1,
    backgroundColor: MKColors.borderLight,
  },
  counterCompareLabel: {
    fontSize: 10,
    color: MKColors.textSecondary,
  },
  counterCompareVal: {
    fontSize: 15,
    fontWeight: '800',
    color: MKColors.textPrimary,
    marginTop: 2,
  },
});
