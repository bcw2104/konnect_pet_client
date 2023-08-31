import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import CustomText from '../elements/CustomText';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';

const CategoryTab = ({ categories, tab, onTabCange }) => {
  return (
    <FlatList
      scrollEnabled={true}
      horizontal={true}
      data={categories || []}
      renderItem={({ item }) => (
        <Pressable
          style={[
            {
              backgroundColor:
                tab == item.categoryId ? COLORS.main : COLORS.white,
            },
            styles.category,
          ]}
          onPress={() => {
            onTabCange(item.categoryId);
          }}
        >
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={tab == item.categoryId ? COLORS.white : COLORS.main}
            fontSize={14}
          >
            {item.category}
          </CustomText>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default memo(CategoryTab);

const styles = StyleSheet.create({
  category: {
    paddingVertical: 7,
    width: 80,
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.main,
    marginHorizontal: 5,
  },
});
