import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import Swiper from 'react-native-swiper';
import { COLORS } from '../../commons/colors';
import CustomText from '../elements/CustomText';
import { utils } from '../../utils/Utils';

const window = Dimensions.get('window');
const bannerWidth = window.width - 30;
const bannerHeight = bannerWidth / 4;

const BannerSwiper = ({ banners }) => {
  return (
    <Swiper
      style={styles.bannerWrap}
      autoplay={true}
      autoplayTimeout={4}
      renderPagination={(index, total, context) => (
        <View style={styles.pagingWrap}>
          <CustomText fontSize={12} fontColor={COLORS.white}>
            {index + 1} / {total}
          </CustomText>
        </View>
      )}
    >
      {!!banners && banners?.map((ele) => {
        {
          return (
            !!ele.imgPath && (
              <Pressable
                key={ele.bannerId}
                style={{ marginHorizontal: 15 }}
                onPress={() => {
                  console.log(ele.bannerId);
                }}
              >
                <Image
                  key={ele.bannerId}
                  source={{
                    uri: utils.pathToUri(ele.imgPath),
                  }}
                  style={{
                    width: bannerWidth,
                    height: bannerHeight,
                    borderRadius: 5,
                  }}
                />
              </Pressable>
            )
          );
        }
      })}
    </Swiper>
  );
};

export default memo(BannerSwiper);

const styles = StyleSheet.create({
  bannerWrap: {
    height: bannerHeight,
    backgroundColor: COLORS.white,
    borderRadius: 5,
  },
  pagingWrap: {
    position: 'absolute',
    bottom: 7,
    right: 22,
    backgroundColor: COLORS.semiTransparentDark,
    padding: 5,
    borderRadius: 10,
  },
});
