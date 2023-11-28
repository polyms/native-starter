import { Image } from 'react-native'

const IconProvider = (source) => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toReactElement: ({ animation, ...props }) => <Image {...props} source={source} />,
})

export const AssetIconsPack = {
  name: 'assets',
  icons: {
    ladybug: IconProvider(require('../../../assets/icons/ladybug.png')),
    hermes: IconProvider(require('../../../assets/icons/hermes.png')),
    components: IconProvider(require('../../../assets/icons/components.png')),
    community: IconProvider(require('../../../assets/icons/community.png')),
    podcast: IconProvider(require('../../../assets/icons/podcast.png')),
  },
}
