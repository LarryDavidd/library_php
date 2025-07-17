import { MainHeader } from "@widgets/MainHeader";
import { FilterBar } from "../../../widgets/filterBar";
import { BookList } from "../../../entities/Books";

export const MainPage = () => {
  return (
    <>
      <MainHeader />
      <section className="wrapper">
        <FilterBar />
        <BookList />
      </section>
    </>
  );
};
