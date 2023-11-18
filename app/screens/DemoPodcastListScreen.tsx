// Interested in migrating from FlatList to FlashList? Check out the recipe in our Ignite Cookbook
// https://ignitecookbook.com/docs/recipes/MigratingToFlashList
import { isRTL } from '../i18n'

import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AccessibilityProps,
  ActivityIndicator,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { api } from '~/services/api'
import { Episode, useEpisode, useEpisodeStore } from '~/stores/episode.store'

import { Button, Card, EmptyState, Icon, Screen, Text, Toggle } from '../components'
import { DemoTabScreenProps } from '../navigators/DemoNavigator'
import { colors, spacing } from '../theme'
import { openLinkInBrowser } from '../utils/openLinkInBrowser'

const ICON_SIZE = 14

const rnrImage1 = require('../../assets/images/rnr-image-1.png')
const rnrImage2 = require('../../assets/images/rnr-image-2.png')
const rnrImage3 = require('../../assets/images/rnr-image-3.png')
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]

export function DemoPodcastListScreen(_props: DemoTabScreenProps<'DemoPodcastList'>) {
  const { t } = useTranslation()
  const { favorites, favoritesOnly, toggleFavoritesOnly } = useEpisodeStore()

  const {
    isRefetching,
    isFetched,
    refetch: manualRefresh,
    data,
  } = useQuery<Episode[]>({
    queryKey: ['episodes'],
    queryFn: async () => {
      const response = await api.getEpisodes()
      if (response.kind === 'ok') {
        return response.episodes as Episode[]
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`, [])
        return []
      }
    },
    initialData: [],
  })

  return (
    <Screen preset="fixed" safeAreaEdges={['top']} contentContainerStyle={$screenContentContainer}>
      <FlashList<Episode>
        data={favoritesOnly ? favorites : data}
        extraData={favorites.length + data.length}
        contentContainerStyle={$flatListContentContainer}
        refreshing={isRefetching}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          !isFetched ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                favoritesOnly ? 'demoPodcastListScreen.noFavoritesEmptyState.heading' : undefined
              }
              contentTx={
                favoritesOnly ? 'demoPodcastListScreen.noFavoritesEmptyState.content' : undefined
              }
              button={favoritesOnly ? null : undefined}
              buttonOnPress={() => manualRefresh()}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: 'contain' }}
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="demoPodcastListScreen.title" />
            {(favoritesOnly || data.length > 0) && (
              <View style={$toggle}>
                <Toggle
                  value={favoritesOnly}
                  onValueChange={toggleFavoritesOnly}
                  variant="switch"
                  labelTx="demoPodcastListScreen.onlyFavorites"
                  labelPosition="left"
                  labelStyle={$labelStyle}
                  accessibilityLabel={t('demoPodcastListScreen.accessibility.switch')}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => <EpisodeCard key={item.guid} episode={item} />}
      />
    </Screen>
  )
}

function EpisodeCard({ episode }: { episode: Episode }) {
  const { t } = useTranslation()
  const { addFavorite, removeFavorite } = useEpisodeStore()
  const isFavorite = useEpisodeStore((s) => s.favorites.some((x) => x.guid === episode.guid))
  const { subtitle, title, datePublished, duration } = useEpisode(episode)
  const liked = useSharedValue(isFavorite ? 1 : 0)

  const imageUri = useMemo(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)]
  }, [])

  // Grey heart
  const animatedLikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    }
  })

  // Pink heart
  const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    }
  })

  /**
   * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
   * @see https://reactnative.dev/docs/accessibility#accessibilityactions
   */
  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityLabel: episode.title,
          accessibilityHint: t('demoPodcastListScreen.accessibility.cardHint', {
            action: isFavorite ? 'unfavorite' : 'favorite',
          }),
        },
        android: {
          accessibilityLabel: episode.title,
          accessibilityActions: [
            {
              name: 'longpress',
              label: t('demoPodcastListScreen.accessibility.favoriteAction'),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === 'longpress') {
              handlePressFavorite()
            }
          },
        },
      }),
    [episode, isFavorite],
  )

  const handlePressFavorite = () => {
    if (liked.value) removeFavorite(episode)
    else addFavorite(episode)
    liked.value = withSpring(liked.value ? 0 : 1)
  }

  const handlePressCard = () => {
    openLinkInBrowser(episode.enclosure.link)
  }

  const ButtonLeftAccessory = useMemo(
    () =>
      function ButtonLeftAccessory() {
        return (
          <View>
            <Animated.View
              style={[$iconContainer, StyleSheet.absoluteFill, animatedLikeButtonStyles]}
            >
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.neutral800} // dark grey
              />
            </Animated.View>
            <Animated.View style={[$iconContainer, animatedUnlikeButtonStyles]}>
              <Icon
                icon="heart"
                size={ICON_SIZE}
                color={colors.palette.primary400} // pink
              />
            </Animated.View>
          </View>
        )
      },
    [],
  )

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      onLongPress={handlePressFavorite}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
            accessibilityLabel={datePublished.accessibilityLabel}
          >
            {datePublished.textLabel}
          </Text>
          <Text style={$metadataText} size="xxs" accessibilityLabel={duration.accessibilityLabel}>
            {duration.textLabel}
          </Text>
        </View>
      }
      content={`${title} - ${subtitle}`}
      {...accessibilityHintProps}
      RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
      FooterComponent={
        <Button
          onPress={handlePressFavorite}
          onLongPress={handlePressFavorite}
          style={[$favoriteButton, isFavorite && $unFavoriteButton]}
          accessibilityLabel={
            isFavorite
              ? t('demoPodcastListScreen.accessibility.unfavoriteIcon')
              : t('demoPodcastListScreen.accessibility.favoriteIcon')
          }
          LeftAccessory={ButtonLeftAccessory}
        >
          <Text
            size="xxs"
            accessibilityLabel={duration.accessibilityLabel}
            weight="medium"
            text={
              isFavorite
                ? t('demoPodcastListScreen.unfavoriteButton')
                : t('demoPodcastListScreen.favoriteButton')
            }
          />
        </Button>
      }
    />
  )
}

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  borderRadius: 50,
  alignSelf: 'flex-start',
}

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: 'left',
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: 'row',
  marginEnd: spacing.sm,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: 'row',
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.md,
  justifyContent: 'flex-start',
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xxxs,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: 'flex-start',
}

const $unFavoriteButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL() ? -1 : 1 }],
}
// #endregion

// @demo remove-file
