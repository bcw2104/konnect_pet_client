import { StyleSheet, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import ImageViewer from '../elements/ImageViewer';

const ProfileImage = ({ uri, style, viewer = true }) => {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const handleViewerClose = () => {
    setImageViewerOpen(false);
  };

  return (
    <>
      <Pressable
        disabled={!viewer}
        onPress={() => {
          setImageViewerOpen(true);
        }}
      >
        <Image
          source={
            !!uri
              ? { uri: uri }
              : require('../../../assets/images/profile/user_default.png')
          }
          style={style}
        />
      </Pressable>
      {!!uri && (
        <ImageViewer
          open={imageViewerOpen}
          handleClose={handleViewerClose}
          uris={[uri]}
        />
      )}
    </>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({});
