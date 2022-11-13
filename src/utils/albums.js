import { transformObject } from "./common";

const albumTransformConfig = {
  fieldsToCopy: ["*"],
  fieldsConfig: {
    category: {
      transformFn: (value) => {
        const { attributes } = value;
        return {
          id: attributes["im:id"],
          label: attributes["label"],
          term: attributes["term"],
          scheme: attributes["scheme"],
        };
      },
    },
    id: {
      transformFn: (value) => {
        const { attributes } = value;
        return attributes["im:id"];
      },
    },
    "im:artist": {
      toKey: "artist",
      transformFn: (value) => {
        const { attributes, label } = value;
        return {
          href: attributes?.["href"],
          label: label,
        };
      },
    },
    "im:contentType": {
      toKey: "contentType",
      transformFn: (value) => {
        const { attributes } = value;
        const contentType = value["im:contentType"];
        const types = [attributes, contentType.attributes];

        return types.reduce((acc, type) => {
          acc[type.term] = type;
          return acc;
        }, {});
      },
    },
    "im:image": {
      toKey: "image",
      transformFn: (value) => {
        return value.reduce((acc, image) => {
          const { attributes, label } = image;

          acc[attributes.height] = {
            href: label,
            height: attributes.height,
          };
          return acc;
        }, {});
      },
    },
    "im:itemCount": {
      toKey: "itemCount",
      transformFn: (value) => {
        return value.label;
      },
    },
    "im:name": {
      toKey: "name",
      transformFn: (value) => {
        return value.label;
      },
    },
    "im:price": {
      toKey: "price",
      transformFn: (value) => {
        const { label, attributes } = value;
        return {
          label: label,
          ...attributes,
        };
      },
    },
    "im:releaseDate": {
      toKey: "releaseDate",
      transformFn: (value) => {
        const { attributes, label } = value;
        return {
          timestamp: label,
          label: attributes.label,
        };
      },
    },
    link: {
      transformFn: (value) => {
        const { attributes } = value;
        return {
          ...attributes,
        };
      },
    },
    rights: {
      transformFn: (value) => {
        return value.label;
      },
    },
    title: {
      transformFn: (value) => {
        return value.label;
      },
    },
  },
};

const feedTransformConfig = {
  fieldsToCopy: ["*"],
  fieldsConfig: {
    entry: {
      toKey: "...",
      transformFn: (value) => {
        return transformAlbums(value, albumTransformConfig);
      },
    },
    author: {
      transformFn: (value) => {
        return {
          name: value?.name?.label,
          uri: value?.uri?.label,
        };
      },
    },
    title: {
      transformFn: (value) => {
        return value.label;
      },
    },
    updated: {
      transformFn: (value) => {
        return value.label;
      },
    },
    icon: {
      transformFn: (value) => {
        return value.label;
      },
    },
    id: {
      transformFn: (value) => {
        return value.label;
      },
    },
  },
};

export const transformAlbums = (albums) => {
  const transformedAlbums = albums.map((item) =>
    transformObject(item, albumTransformConfig)
  );

  return transformedAlbums.reduce(
    (acc, album, index) => {
      album["rank"] = index + 1;
      acc.albumList.push(album.id);
      acc.albumMap[album.id] = album;
      acc.searchIndex[album.id] = getSearchableString(album);
      acc.rank[album.id] = index + 1;
      return acc;
    },
    {
      albumList: [],
      albumMap: {},
      searchIndex: {},
      rank: {},
    }
  );
};

export const getSearchableString = (album) => {
  return [album.name, album.artist.label, album.title].join(" ").toLowerCase();
};

export const transformFeed = (feedData) => {
  return transformObject(feedData, feedTransformConfig);
};
