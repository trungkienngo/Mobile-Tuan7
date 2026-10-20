import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, TextInput, SectionList, ActivityIndicator, 
  StyleSheet, Alert, FlatList, RefreshControl 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { groupByCity } from './compomemts/tour';
import TourItem, { Tour } from './compomemts/TourItem';

const API_URL = 'https://6abb5a71b2118ed7abb85186.mockapi.io/sanpham'; 

export default function App() {
  const [search, setSearch] = useState('');
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTours = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAllTours(data);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTours();
  };

  const handlePressTour = (tour: Tour) => {
    Alert.alert("Chi tiết Tour", `Tên: ${tour.name}\nNgày đi: ${tour.departure}\nSố ngày: ${tour.days} ngày\nGiá: ${tour.price} VND`);
  };

  const handleToggleFavorite = async (id: string, next: boolean) => {
    const previousTours = [...allTours];
    setAllTours(prev => prev.map(tour => tour.id === id ? { ...tour, isFavorite: next } : tour));

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });
      if (!response.ok) throw new Error('Lỗi Server');
    } catch (error) {
      setAllTours(previousTours);
      Alert.alert("Lỗi", "Không thể cập nhật yêu thích.");
    }
  };

  const filteredGroupedTours = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    
    if (keyword) {
      const filtered = allTours.filter(tour => 
        tour.name.toLowerCase().includes(keyword)
      );
      return groupByCity(filtered);
    }
    
    return groupByCity(allTours);
  }, [allTours, search]);

  const favoriteTours = allTours.filter((t) => t.isFavorite);

  const renderListHeader = () => (
    <View style={styles.favSection}>
      <Text style={styles.favTitle}>Tour yêu thích ({favoriteTours.length})</Text>
      {favoriteTours.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có tour yêu thích</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={favoriteTours}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TourItem tour={item} compact={true} onPress={handlePressTour} onToggleFavorite={handleToggleFavorite} />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
        />
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tour Việt</Text>
          <Text style={styles.mssv}>MSSV: 12345678 - Họ Tên SV</Text>
          <TextInput 
            placeholder="Tìm tour theo tên..." 
            value={search} 
            onChangeText={setSearch} 
            style={styles.input}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#e67e22" style={{ marginTop: 20 }} />
        ) : (
          <SectionList
            sections={filteredGroupedTours}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={
              <Text style={styles.emptySearchMsg}>Không tìm thấy tour phù hợp</Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#e67e22"]} />
            }
            renderItem={({ item }) => (
              <TourItem tour={item} onPress={handlePressTour} onToggleFavorite={handleToggleFavorite} />
            )}
            renderSectionHeader={({ section: { title, data } }: any) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{`${title} · ${data.length} tour`}</Text>
              </View>
            )}
            stickySectionHeadersEnabled={true}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#e67e22' },
  mssv: { textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, backgroundColor: '#fff' },
  sectionHeader: { backgroundColor: '#e0e0e0', padding: 8, borderLeftWidth: 3, borderColor: '#e67e22' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  favSection: { paddingVertical: 16, backgroundColor: '#fff', marginBottom: 10 },
  favTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginBottom: 10, color: '#d35400' },
  emptyText: { fontStyle: 'italic', color: '#7f8c8d', marginHorizontal: 16 },
  emptySearchMsg: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#888', fontStyle: 'italic' }
});