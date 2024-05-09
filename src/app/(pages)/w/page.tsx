interface CardProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
}
const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="border border-white/10 p-4 rounded-[2rem]">
      <div className="flex flex-col gap-2 items-center text-xl">
        <div className="text-center dimmed-3 max-w-sm sm:max-w-[550px] md:max-w-[650px] lg:max-w-[850px]">
          <h3 className="glows-dimmed dimmed-4 text-2xl font-bold">{title}</h3>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-8 md:mt-20">
      <Card title="Hi">
        <p>
          I&apos;m Ashref Gwader, I&apos;m a technical educator, poker player,
          motorcycle enthusiast, basketball player, health enthusiast, thinker,
          and philosopher. Oh I almost forgot, yeah and a software developer
          with 7+ years of experience having worked with over 100+ startups and
          teams worldwide.
        </p>
      </Card>
      <Card title="Hi, I'm Ashref Gwader">
        <p>
          I&apos;m a technical educator, poker player, motorcycle enthusiast,
          basketball player, health enthusiast, thinker, and philosopher. Oh,
          and I almost forgot—I&apos;m also a software developer from Tunisia.
          Over the past 7+ years, I&apos;ve been involved in building, scaling,
          and organizing software teams, collaborating with over 100 startups
          worldwide. My expertise lies predominantly in web technologies,
          including HTTP/2, HTTP/3, gRPC, GraphQL, and other related
          technologies. Apart from web development, I advocate for quality code,
          particularily for Python and Typescript, which often involves
          reviewing and correcting code and design decisions, whether or not
          they are directly related to web development.
        </p>
      </Card>
    </div>
  );
}
