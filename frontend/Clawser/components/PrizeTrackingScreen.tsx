import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrizeCard from './PrizeCard';
import { callProtectedRoute } from '../services/ApiService';
import type { Prize } from '../types/prize';
import { PrizeTrackingProps } from './Routes';
import Background from './Background';
import HeaderBar from './HeaderBar';

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

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await callProtectedRoute('/api/prizes', { method: 'GET' });
      if (res.ok) {
        const data = (await res.json()) as { prizes?: Prize[] };
        const list = Array.isArray(data.prizes) ? data.prizes : [];
        setPrizes(list.map(normalizePrize));
      } else {
        setPrizes([]);
      }
    } catch {
      setPrizes([]);
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
    <View style={styles.screen}>
      <Background>
        <HeaderBar />
        <Text style={styles.title}>Prize tracking</Text>
        <Text style={styles.subtitle}>
          Status: Not Shipped (Red Border) → Shipped (Blue border) → Delivered (Green Border).
        </Text>

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
      </Background>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
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