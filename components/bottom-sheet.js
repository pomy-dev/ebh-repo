// BottomSheetModal.tsx (or .js)
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const BottomSheetModal = ({ visible, onClose, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.bottomSheet}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: height * 0.3,
  },
});

export default BottomSheetModal;
