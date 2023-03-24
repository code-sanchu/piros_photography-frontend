import { type StaticData } from "./staticData";

const AlbumsPage = (staticData: StaticData) => {
  return (
    <div>
      <h1>Albums page</h1>
      <div>{JSON.stringify(staticData)}</div>
    </div>
  );
};

export default AlbumsPage;
