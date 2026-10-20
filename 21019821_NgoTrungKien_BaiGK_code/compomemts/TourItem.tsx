import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate, getSeatLabel } from './tour';

export type Tour = {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
};

export type TourItemProps = {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
};

const TourItem = ({ tour, compact = false, onPress, onToggleFavorite }: TourItemProps) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(tour.price) + ' ₫';
  const seatLabel = getSeatLabel(tour.seats);
  const isRedText = tour.seats <= 3;

  return (
    <TouchableOpacity 
      // Kết hợp style mảng: Nếu compact=true thì thêm cardCompact đè lên card
      style={[styles.card, compact && styles.cardCompact]} 
      onPress={() => onPress(tour)}
    >
      <View style={compact && styles.imageWrapperCompact}>
        <Image 
          source={{ uri: tour.image }} 
          style={[styles.image, compact && styles.imageCompact]} 
        />
        {/* Nút tim ở góc phải ảnh khi compact = true */}
        {compact && (
          <TouchableOpacity
            testID="fav-btn"
            style={styles.heartBtnCompact}
            onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
          >
            <Text style={[styles.heartIcon, tour.isFavorite && styles.textRed]}>
              {tour.isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.info, compact && styles.infoCompact]}>
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={compact ? 1 : 2}>
          {tour.name}
        </Text>
        
        {/* Chỉ hiện ở chế độ mặc định (compact = false) */}
        {!compact && <Text style={styles.city}>{tour.city}</Text>}
        {!compact && (
          <Text style={styles.details}>
            📅 {formatDate(tour.departure)} · {tour.days} ngày
          </Text>
        )}
        
        <Text style={styles.price}>{formattedPrice}</Text>
        
        {/* Chỉ hiện số chỗ ở chế độ mặc định */}
        {!compact && (
          <Text style={[styles.seat, isRedText && styles.textRed]}>
            {seatLabel}
          </Text>
        )}
      </View>

      {/* Nút tim ở mép phải thẻ khi compact = false */}
      {!compact && (
        <TouchableOpacity
          testID="fav-btn"
          style={styles.heartBtn}
          onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
        >
          <Text style={[styles.heartIcon, tour.isFavorite && styles.textRed]}>
            {tour.isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Style chung
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginHorizontal: 16, marginBottom: 10, borderRadius: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 12 },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  city: { fontSize: 13, color: '#666', marginTop: 2 },
  details: { fontSize: 13, color: '#444', marginVertical: 4 },
  price: { fontSize: 15, fontWeight: 'bold', color: '#e67e22' },
  seat: { fontSize: 13, color: '#27ae60', marginTop: 2, fontWeight: 'bold' },
  textRed: { color: 'red' },
  heartBtn: { position: 'absolute', top: 10, right: 10, padding: 5, zIndex: 10 },
  heartIcon: { fontSize: 24, color: '#ccc' },

  // Style đè lên khi compact = true
  cardCompact: { flexDirection: 'column', width: 160, padding: 0, marginHorizontal: 0 },
  imageWrapperCompact: { position: 'relative' },
  imageCompact: { width: '100%', height: undefined, aspectRatio: 4/3, borderRadius: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8, marginRight: 0 },
  infoCompact: { padding: 10 },
  nameCompact: { fontSize: 14, marginBottom: 4 },
  heartBtnCompact: { position: 'absolute', top: 5, right: 5, padding: 5, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20 },
});

export default TourItem;