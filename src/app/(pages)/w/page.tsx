const Divider: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children }) => {
  return <>{children}</>;
};

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
}
const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="border border-white/10 p-4 rounded-[2rem]">
      <div className="flex flex-col gap-2 items-center text-xl">
        <div className="text-center dimmed-3 max-w-sm sm:max-w-[550px] md:max-w-[650px] lg:max-w-[850px]">
          <h3 className="glows-dimmed dimmed-4 text-2xl font-bold">{title}</h3>
          <div className="p-2 my-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card title="Team">
        <p>
          Experiencing roadblocks due to tricky bugs or intricate feature
          implementations? My services extend beyond advice to actively
          integrate with your development process
          
        </p>
      </Card>
      <Card title="Another Title">
        <p>
          Experiencing roadblocks due to tricky bugs or intricate feature
          implementations? My services extend beyond advice to actively
          integrate with your development process. 
        </p>
      </Card>
    </div>
  );
}
