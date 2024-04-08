/* eslint-disable */

const FrontEnd = ['React', 'Next', 'Framer', 'GSAP'];

export default function AboutMe2() {
  return (
    <div className="w-full py-12 lg:py-24">
      <div className="container grid gap-6 px-4 md:gap-10 md:px-6 lg:grid-cols-2 xl:gap-16">
        <div className="flex flex-col gap-4 lg:order-last lg:gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              About Me
            </h1>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
              Hi, I'm a passionate software engineer with a love for creating
              elegant solutions to complex problems. My experience spans various
              domains, from web development to cloud computing. I'm always eager
              to learn new technologies and frameworks to stay ahead in the
              ever-evolving tech landscape.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter">Frontend</h2>
            <div className="flex flex-wrap items-center gap-[0.625rem] text-sm dimmed-4">
              {FrontEnd.map((tech) => (
                <span
                  key={tech}
                  className="relative rounded-full px-2 py-1 border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter">Experience</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">Senior Frontend Engineer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Leading the development of a next-generation customer
                  engagement platform.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">Cloud Architect</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Designing scalable and secure cloud infrastructure for
                  enterprise clients.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter">Education</h2>
            <div className="space-y-2">
              <div className="font-semibold">Bachelor of Computer Science</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                University of Science and Technology
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">
                Certified AWS Solutions Architect
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Amazon Web Services
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <img
            alt="Profile Picture"
            className="rounded-full w-60 border aspect-square object-cover object-center justify-self-start"
            height="800"
            src="https://avatars.githubusercontent.com/u/126174609?v=4"
            width="1200"
          />
        </div>
      </div>
    </div>
  );
}
