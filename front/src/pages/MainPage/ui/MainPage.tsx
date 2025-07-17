import { MainHeader } from "@widgets/MainHeader";
import { FilterBar } from "@widgets/filterBar";
import { BookList } from "@entities/Books";
import { ParseSection } from "@widgets/ParseSection";

export const MainPage = () => {
  return (
    <>
      <MainHeader />
      <section className="wrapper">
        <ParseSection />
      </section>
      <section className="wrapper">
        <FilterBar />
        <BookList />
      </section>
    </>
  );
};
