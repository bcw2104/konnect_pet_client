import { StyleSheet, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import ImageViewer from '../elements/ImageViewer';

const PetImage = ({ uri, style, viewer = true }) => {
  const [openImageViewer, setOpenImageViewer] = useState(false);

  const handleViewerClose = () => {
    setOpenImageViewer(false);
  };

  return (
    <>
      <Pressable
        disabled={!viewer}
        onPress={() => {
          setOpenImageViewer(true);
        }}
      >
        <Image
          source={
            !!uri
              ? {
                  uri: uri,
                }
              : require('../../../assets/images/profile/pet_default.png')
          }
          style={style}
        />
      </Pressable>
      {!!uri && (
        <ImageViewer
          open={openImageViewer}
          handleClose={handleViewerClose}
          uris={[uri]}
        />
      )}
    </>
  );
};

export default PetImage;

const styles = StyleSheet.create({});
