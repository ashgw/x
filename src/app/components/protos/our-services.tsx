/* eslint-disable */
export default function OurServices() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Our Services
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Let our experts guide your team to faster, more reliable software
            delivery.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">Cloud Migration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Move your workloads to the cloud with minimal disruption.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">Continuous Integration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Automate your workflow with continuous integration.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">Infrastructure as Code</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your infrastructure with version control.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">Continuous Deployment</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Automate your workflow with continuous deployment.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">Site Reliability Engineering</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Improve the reliability of your software systems.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xl font-bold">DevSecOps</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Integrate security into your software development process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
