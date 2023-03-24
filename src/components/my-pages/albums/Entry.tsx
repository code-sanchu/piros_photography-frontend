import { api } from "~/utils/api";

// ! can pass data through staticData, but probs no point. tRPC handles the query from staticProps

const AlbumsPage = () => {
  const albums = api.album.albumsPageGetAll.useQuery();
  const { data, isLoading, isFetched } = albums;
  console.log("data:", data);
  console.log("isLoading:", isLoading);
  console.log("isFetched:", isFetched);
  console.log("-----------------------------");

  return (
    <div>
      <h1>Albums page</h1>
      {/* <div>{JSON.stringify(staticData)}</div> */}
      <div>{JSON.stringify(albums)}</div>
    </div>
  );
};

export default AlbumsPage;
