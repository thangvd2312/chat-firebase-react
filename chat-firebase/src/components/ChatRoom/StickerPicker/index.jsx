import { useEffect, useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import axios from "axios";
import * as cheerio from "cheerio";
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

const baseURL = "http://cdn.jerrytsq.asia:8080/stickers/";

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

  const getImageUrls = async (url) => {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const urls = [];

    // Lấy tất cả các liên kết trong trang
    $("a").each((_, element) => {
      const link = $(element).attr("href");
      if (link) {
        // Nếu là file ảnh
        if (link.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          urls.push(`${url}/${link}`);
        }
      }
    });

    return urls;
  };

  const getFoldersWithImages = async (url) => {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const folderData = [];

    // Lấy tất cả các liên kết trong trang
    $("a").each((_, element) => {
      const link = $(element).attr("href");
      if (link && !link.includes(".")) {
        // Kiểm tra nếu là thư mục
        const folderName = link;
        const folderUrl = `${url}${folderName}`;
        const images = getImageUrls(folderUrl); // Lấy ảnh trong thư mục

        folderData.push({ folderName, images });
      }
    });

    return Promise.all(
      folderData.map(async (folder) => ({
        folderName: folder.folderName,
        images: await folder.images,
      }))
    );
  };

  useEffect(() => {
    const load = async () => {
      const loadedStickers = await getFoldersWithImages(baseURL);
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
                {stickerGroup.folderName.replaceAll("/", "")}
              </StickerGroupName>
              <StickerGrid>
                {stickerGroup.images.map((sticker, idx) => (
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
