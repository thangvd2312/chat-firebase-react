import { useEffect, useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import {
  DB_NAME,
  LAST_UPDATE_KEY,
  STICKER_CACHE_DURATION,
  STORE_NAME,
} from "@/constants/app";
import { openDB } from "idb";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "@/firebase/config";
import axios from "axios";
const PopupContainer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 10px;
  width: 350px;
  background-color: #2c2f33;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  color: #fff;
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #23272a;
  padding: 10px;
`;

const Tab = styled.div`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  &.active {
    background-color: #7289da;
    font-weight: bold;
  }
`;

const PickerWrapper = styled.div`
  .emoji-picker {
    background-color: #2c2f33 !important;
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
    color: #fff !important;
  }
`;

//
const StickerContainer = styled.div`
  height: 450px;
  overflow-y: auto;
  padding: 15px 0 15px 15px;
`;

const StickerGroup = styled.div`
  margin-bottom: 20px;
`;

const StickerGroupName = styled.h3`
  color: #fff;
  font-size: 18px;
`;

const StickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const Sticker = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const GifContainer = styled.div`
  padding: 0 10px; // Add padding around the content
  max-width: 400px; // Set a maximum width for the container
  margin: 0 auto; // Center the container
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #2c2f33;
  color: #fff;
  outline: none;

  &:focus {
    border-color: #7289da;
  }
`;

const GifGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  overflow-y: auto;
  height: 400px;
`;

const GifImage = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer;
  border-radius: 8px;
`;

const StickerPopup = ({ handleSelectedReactIcon }) => {
  const [activeTab, setActiveTab] = useState("emoji");
  const [stickers, setStickers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (activeTab === "gifs") {
      fetchGifs(searchQuery, 0);
    }
  }, [activeTab, searchQuery]);
  function onEmojiClick(emojiData) {
    handleSelectedReactIcon({
      type: "emoji",
      data: emojiData.emoji,
    });
  }

  function handleClickSticker(event) {
    handleSelectedReactIcon({
      type: "sticker",
      data: event.target.src,
    });
  }

  async function getDb() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex(LAST_UPDATE_KEY, "last_update");
        }
      },
    });
  }

  async function shouldUpdateStickers() {
    const db = await getDb();
    const lastUpdate = await db.get(STORE_NAME, LAST_UPDATE_KEY);

    if (!lastUpdate) return true;

    const now = Date.now();
    return now - lastUpdate.timestamp > STICKER_CACHE_DURATION;
  }

  async function fetchStickersFromFirebase() {
    const rootRef = ref(storage, "/"); // Thay đổi '/' thành đường dẫn cụ thể nếu cần
    const result = await listAll(rootRef);

    // Duyệt qua từng thư mục
    const folderPromises = result.prefixes.map(async (folderRef) => {
      const folderResult = await listAll(folderRef);

      // Lấy URL cho mỗi tệp trong thư mục
      const imageUrls = await Promise.all(
        folderResult.items.map((itemRef) => getDownloadURL(itemRef))
      );

      return {
        folderName: folderRef.name,
        images: imageUrls,
      };
    });

    // Chờ tất cả các thư mục được xử lý
    const allFoldersWithImages = await Promise.all(folderPromises);
    return allFoldersWithImages;
  }

  async function cacheStickers(stickerUrls) {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    stickerUrls.forEach((url, index) => {
      store.put({
        id: `sticker_${index}`,
        data: url,
      });
    });

    store.put({
      id: LAST_UPDATE_KEY,
      timestamp: Date.now(),
    });

    await tx.done;
  }

  async function loadStickers() {
    const needUpdate = await shouldUpdateStickers();
    if (needUpdate) {
      const stickers = await fetchStickersFromFirebase();
      await cacheStickers(stickers);
    }

    const db = await getDb();
    const stickers = await db.getAll(STORE_NAME);
    return stickers.filter((sticker) => sticker.id !== LAST_UPDATE_KEY);
  }

  const fetchGifs = async (query, offset) => {
    try {
      const endpoint = query ? "search" : "trending";
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/${endpoint}`,
        {
          params: {
            api_key: "0XmWL4pABnjSg8w6cr4Ro4rzGC9MOFv3",
            q: query,
            limit: 20,
            offset: offset,
          },
        }
      );
      setGifs((prevGifs) =>
        offset === 0 ? response.data.data : [...prevGifs, ...response.data.data]
      );
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      const newOffset = offset + 20;
      setOffset(newOffset);
      fetchGifs(searchQuery, newOffset);
    }
  };

  useEffect(() => {
    const load = async () => {
      const loadedStickers = await loadStickers();
      setStickers(loadedStickers);
    };
    load();
  }, []);

  return (
    <PopupContainer>
      <TabHeader>
        <Tab
          className={activeTab === "emoji" ? "active" : ""}
          onClick={() => setActiveTab("emoji")}
        >
          Emoji
        </Tab>
        <Tab
          className={activeTab === "stickers" ? "active" : ""}
          onClick={() => setActiveTab("stickers")}
        >
          Stickers
        </Tab>
        <Tab
          className={activeTab === "gifs" ? "active" : ""}
          onClick={() => setActiveTab("gifs")}
        >
          GIFs
        </Tab>
      </TabHeader>
      <PickerWrapper>
        {activeTab === "emoji" && (
          <Picker
            onEmojiClick={onEmojiClick}
            className="emoji-picker"
            searchDisabled
            previewConfig={{
              showPreview: false,
            }}
            lazyLoadEmojis={true}
          />
        )}
      </PickerWrapper>
      {activeTab === "stickers" && (
        <StickerContainer>
          {stickers.map((stickerGroup, index) => (
            <StickerGroup key={index}>
              <StickerGroupName>
                {stickerGroup.data.folderName}
              </StickerGroupName>
              <StickerGrid>
                {stickerGroup.data.images.map((sticker, idx) => (
                  <Sticker
                    key={idx}
                    src={sticker}
                    alt={`sticker-${idx}`}
                    onClick={handleClickSticker}
                  />
                ))}
              </StickerGrid>
            </StickerGroup>
          ))}
        </StickerContainer>
      )}
      {activeTab === "gifs" && (
        <GifContainer>
          <SearchInput
            type="text"
            placeholder="Search GIFs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOffset(0);
            }}
          />
          <GifGrid onScroll={handleScroll}>
            {gifs.map((gif) => (
              <GifImage
                key={gif.id}
                src={gif.images.fixed_height.url}
                alt={gif.title}
                onClick={() =>
                  handleSelectedReactIcon({
                    type: "gif",
                    data: gif.images.fixed_height.url,
                  })
                }
              />
            ))}
          </GifGrid>
        </GifContainer>
      )}
    </PopupContainer>
  );
};

export default StickerPopup;
