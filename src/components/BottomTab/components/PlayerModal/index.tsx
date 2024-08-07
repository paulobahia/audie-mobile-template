import {ArrowDown2, PauseCircle, PlayCircle} from 'iconsax-react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {MoreVertical} from 'lucide-react-native';
import {useColorScheme} from 'nativewind';
import TrackPlayer from 'react-native-track-player';
import {useState} from 'react';
import xmlJs from 'xml-js';
import {WaveIndicator} from 'react-native-indicators';
import {
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {BottomTabNavigationEventMap} from '@react-navigation/bottom-tabs';
import {OptionsModal} from '../OptionsModal';
import axios from 'axios';

interface PlayerModalProps {
  onShowPlayer(): void;
  PlayAudio(): Promise<void>;
  PauseAudio(): Promise<void>;
  isShowPlayer: boolean;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isOnLive: boolean;
  setIsOnLive: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  infoMusic: {
    title: string;
    artist: string;
  };
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  onShowPlayer,
  PlayAudio,
  PauseAudio,
  isShowPlayer,
  isPlaying,
  setIsPlaying,
  isLoading,
  setIsLoading,
  isLoaded,
  setIsLoaded,
  isOnLive,
  setIsOnLive,
  navigation,
  infoMusic,
}) => {
  const {colorScheme} = useColorScheme();
  const [showOptionsPlayer, setShowOptionsPlayer] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string>('A SEGUIR');
  const [letter, setLetter] = useState<string>('');

  async function handleLiveAudio() {
    setIsLoading(true);
    setIsLoaded(false);
    try {
      await TrackPlayer.stop();
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
    setIsPlaying(true);
    setIsOnLive(true);
    setIsLoaded(true);
    setIsLoading(false);
  }

  function handleShowOptionsPlayer() {
    setShowOptionsPlayer(!showOptionsPlayer);
  }

  async function handleSelectedOptions(options: string) {
    await getLetter();
    setSelectedOptions(options);
    setShowOptionsPlayer(true);
  }

  function goToTelevision() {
    navigation.navigate('TV');
  }

  async function getLetter() {
    await axios
      .get(
        'https://api.vagalume.com.br/search.php' +
          '?art=' +
          infoMusic.artist +
          '&mus=' +
          infoMusic.title +
          '&apikey=e9c839b8f17971df258e205c44e1314b',
      )
      .then(response => {
        if (response.data) {
          setLetter(response.data.mus[0].text.replace(/\n/g, '</br>'));
        }
      })
      .catch(error => {
        console.log('error letra >>', error);
      });
  }

  return (
    <>
      <Modal
        backdropTransitionOutTiming={0}
        onBackdropPress={onShowPlayer}
        onSwipeComplete={onShowPlayer}
        onBackButtonPress={onShowPlayer}
        isVisible={isShowPlayer}
        swipeDirection="down"
        className="m-0">
        <View className="flex items-start justify-between flex-1 p-5 bg-white dark:bg-background-dark2">
          <View className="flex flex-row items-center justify-between w-full">
            <TouchableOpacity onPress={onShowPlayer}>
              <ArrowDown2
                size={20}
                color={colorScheme === 'dark' ? '#FFF' : '#000'}
                variant="Outline"
              />
            </TouchableOpacity>
            <View className="flex flex-row items-center justify-center bg-gray-300 rounded-full dark:bg-background-dark">
              <View>
                <Text className="font-medium py-1.5 px-3 text-black dark:text-white rounded-full bg-gray-100 dark:bg-background-darkLight">
                  Rádio
                </Text>
              </View>
              <TouchableOpacity onPress={goToTelevision}>
                <Text className="font-medium py-1.5 px-3 text-black dark:text-white rounded-full  bg-gray-300 dark:bg-background-dark">
                  TV
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <MoreVertical size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-col items-center justify-center w-full px-3 gap-y-3">
            <Image
              className="h-[50%] w-full flex rounded-md"
              source={require('../../../../assets/logo.png')}
            />
            <View className="flex flex-col items-center justify-center w-full">
              <Text className="text-xl font-medium text-black dark:text-white">
                103 FM Aracaju
              </Text>
            </View>
          </View>
          <View className="relative flex items-center justify-center w-full">
            {isLoading ? (
              <WaveIndicator
                style={{position: 'absolute'}}
                size={100}
                count={2}
                waveFactor={0.3}
                color="white"
              />
            ) : (
              <View className="absolute">
                {isPlaying ? (
                  <TouchableOpacity onPress={PauseAudio}>
                    <PauseCircle size="100" color={'grey'} variant="Bulk" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={PlayAudio}>
                    <PlayCircle size="100" color={'grey'} variant="Bulk" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {isLoaded && (
            <TouchableOpacity
              disabled={isOnLive}
              onPress={handleLiveAudio}
              className="flex flex-row items-center justify-center w-full mt-3 gap-x-1">
              <View
                className={`p-1 rounded-full ${
                  isOnLive ? 'bg-red-600 animate-ping' : 'bg-neutral-600'
                }`}
              />
              <Text className="font-medium text-neutral-700 dark:text-white">
                AO VIVO
              </Text>
            </TouchableOpacity>
          )}
          <View className="flex flex-row items-center justify-around w-full px-3">
            <TouchableOpacity onPress={() => handleSelectedOptions('LETRA')}>
              <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                LETRA
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <OptionsModal
        onShowOptionsPlayer={handleShowOptionsPlayer}
        onSelectedOptions={handleSelectedOptions}
        PlayAudio={PlayAudio}
        PauseAudio={PauseAudio}
        showOptionsPlayer={showOptionsPlayer}
        isPlaying={isPlaying}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        infoMusic={infoMusic}
        letter={letter}
      />
    </>
  );
};
