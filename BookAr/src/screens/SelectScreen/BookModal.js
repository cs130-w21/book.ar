import React, { useState, useEffect } from 'react';
import { ScrollView, Button, Image, Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import {firebase} from '../../utils/firebase';
import {addToReading} from '../../utils';

export default function BookModal({ showModal, book, onDismiss }) {
  return (
    <Modal
      animationType='fade'
      visible={showModal}
      onRequestClose={() => {onDismiss()}}
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.modalBg}
          onPress={() => { onDismiss() }}
        />
        <View style={styles.modal}>
          <View style={styles.modalBook}>
            <Image style={styles.modalBookImg} source={{ uri: book.coverUrl }} />
            <Text style={styles.modalBookTitle}>{book.title}</Text>
            <Text style={styles.modalBookSubtitle}>{book.author}</Text>
            <ScrollView>
              <Text
                style={styles.modalBookBodyText}
              >{book.description}</Text>
            </ScrollView>
          </View>
          <View style={styles.modalButtons}>
            <Button
              style={styles.modalButton}
              title="I'll check this out"
              onPress={async () => {
                await addToReading(book);
                onDismiss();
              }}
            />
            <Button
              style={styles.modalButton}
              color={'#aaa'}
              title="Not interested"
              onPress={() => {
                onDismiss();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
