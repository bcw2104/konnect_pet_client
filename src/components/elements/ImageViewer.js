import { StyleSheet, View } from 'react-native';
import React from 'react';
import ImageView from 'react-native-image-viewing';
import CustomText from './CustomText';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';

const ImageViewer = ({ index = 0, uris, open, handleClose }) => {
  return (
    <ImageView
      images={uris.map((uri) => ({ uri: uri }))}
      imageIndex={index}
      visible={open}
      onRequestClose={handleClose}
      doubleTapToZoomEnabled={true}
      FooterComponent={({ imageIndex }) => {
        return (
          <View
            style={{
              paddingBottom: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CustomText
              fontColor={COLORS.white}
              fontWeight={FONT_WEIGHT.BOLD}
              fontSize={17}
            >
              {imageIndex + 1} / {uris.length}
            </CustomText>
          </View>
        );
      }}
    />
  );
};

export default ImageViewer;

const styles = StyleSheet.create({});
