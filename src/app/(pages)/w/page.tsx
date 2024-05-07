export default function Page() {
  return (
    <div className="flex items-center justify-center mt-12">
      <div className="border border-white/10 p-4 rounded-[2rem]">
        <div className="flex flex-col gap-2 items-center text-xl">
          <div
            className="text-center dimmed-3
  max-w-sm sm:max-w-[550px]  md:max-w-[650px]  lg:max-w-[850px]"
          >
            <h3 className="glows-dimmed dimmed-4 text-2xl font-bold">
              Software Consulting
            </h3>
            <p className="p-2 my-1 ">
              Experiencing roadblocks due to tricky bugs or intricate feature
              implementations? Bring me onboard to bolster your team&apos;s
              progress and expedite development. Beyond immediate fixes, my
              consulting services include strategic guidance and decision-making
              support. This includes: Team management, tailored training
              sessions and valuable recommendations. Get in touch
            </p>
            <h3 className="glows-dimmed dimmed-4 text-2xl font-bold">Audits</h3>
            <p className="p-2 my-1 ">
              I conduct thorough independent audits to review and analyze your
              software code quality and architectural decisions. During these
              audits, I provide detailed insights, identify areas for
              improvement, pinpoint potential vulnerabilities, and highlight
              optimization opportunities. Learn more
            </p>
            <h3 className="glows-dimmed dimmed-4 text-2xl font-bold">
              Team Integration
            </h3>
            <p className="p-2 my-1 ">
              Experiencing roadblocks due to tricky bugs or intricate feature
              implementations? My services extend beyond advice to actively
              integrate with your development process. So bring me onboard to
              bolster your team&apos;s progress and expedite development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
