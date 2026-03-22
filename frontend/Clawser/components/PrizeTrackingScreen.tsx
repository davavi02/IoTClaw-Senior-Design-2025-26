import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import CoinsButton from './CoinsButton';
import ClawzerTitle from '../assets/ClawzerTitle.png';
import PrizeCard from './PrizeCard';
import { callProtectedRoute } from '../services/ApiService';
import { MOCK_PRIZES } from '../data/mockPrizes';
import type { Prize } from '../types/prize';
import { PrizeTrackingProps } from './Routes';

const imagePlaceholder = (id: string) => `https://picsum.photos/seed/prize-${id}/200/200`;

function normalizePrize(p: Prize): Prize {
  const url = p.imageUrl?.trim();
  return {
    ...p,
    imageUrl: url ? url : imagePlaceholder(p.id),
  };
}

const PrizeTrackingScreen: React.FC<PrizeTrackingProps> = ({ navigation }) => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [errorNote, setErrorNote] = useState<string | null>(null);

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorNote(null);
    try {
      const res = await callProtectedRoute('/api/prizes', { method: 'GET' });
      if (!res.ok) {
        setPrizes(MOCK_PRIZES.map(normalizePrize));
        setDemoMode(true);
        setErrorNote('Could not load your prizes from the server. Showing sample data.');
        return;
      }
      const data = (await res.json()) as { prizes?: Prize[] };
      const list = Array.isArray(data.prizes) ? data.prizes : [];
      if (list.length === 0) {
        setPrizes([]);
        setDemoMode(false);
        return;
      }
      setPrizes(list.map(normalizePrize));
      setDemoMode(false);
    } catch {
      setPrizes(MOCK_PRIZES.map(normalizePrize));
      setDemoMode(true);
      setErrorNote('Network error. Showing sample data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(false);
    }, [load])
  );

  const onRefresh = () => load(true);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.headerOutline}>
          <View style={styles.headerSide}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Image source={ClawzerTitle} style={styles.topLogo} />
          </View>
          <View style={[styles.headerSide, styles.headerSideRight]}>
            <CoinsButton onPress={() => navigation.navigate('Shop')} />
          </View>
        </View>

        <Text style={styles.title}>Prize tracking</Text>
        <Text style={styles.subtitle}>
          Status: default (gray) → shipped (blue border) → delivered (green).
        </Text>

        {demoMode && errorNote ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{errorNote}</Text>
          </View>
        ) : null}

        {loading && !refreshing ? (
          <View style={styles.centerFill}>
            <ActivityIndicator size="large" color="#00E5FF" />
            <Text style={styles.loadingText}>Loading prizes…</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5FF" />
            }
            showsVerticalScrollIndicator={false}
          >
            {prizes.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>No prizes yet</Text>
                <Text style={styles.emptyBody}>
                  When you win physical prizes, they will show up here with shipping status.
                </Text>
                <TouchableOpacity
                  style={styles.playLink}
                  onPress={() => navigation.navigate('CabSelect')}
                >
                  <Text style={styles.playLinkText}>Play a cabinet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              prizes.map((p) => (
                <View key={p.id} style={styles.cardWrap}>
                  <PrizeCard prize={p} />
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0029' },
  screen: { flex: 1 },
  headerOutline: {
    width: '100%',
    minHeight: 91,
    borderBottomWidth: 3,
    borderBottomColor: '#FF2F00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0B0029',
  },
  headerSide: { width: 100, justifyContent: 'center' },
  headerSideRight: { alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#00E5FF', fontSize: 16, fontWeight: '700' },
  topLogo: { width: 120, height: 40, resizeMode: 'contain' },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  subtitle: {
    color: '#88AACC',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#332200',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB020',
  },
  bannerText: { color: '#FFDDAA', fontSize: 13, textAlign: 'center' },
  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#88AACC', marginTop: 12 },
  scroll: { paddingBottom: 32, paddingTop: 8, alignItems: 'center' },
  cardWrap: { marginBottom: 8, alignItems: 'center' },
  emptyBox: {
    marginTop: 40,
    marginHorizontal: 24,
    padding: 20,
    borderWidth: 3,
    borderColor: '#FF2F00',
    borderRadius: 4,
    backgroundColor: '#001F3F',
    alignItems: 'center',
  },
  emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptyBody: { color: '#88AACC', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  playLink: {
    marginTop: 18,
    backgroundColor: '#00E5FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  playLinkText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

export default PrizeTrackingScreen;
