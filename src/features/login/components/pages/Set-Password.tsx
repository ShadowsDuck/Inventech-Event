import inventechBanner from "/src/assets/inventech-banner.png";

export default function setPassword() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src={inventechBanner}
          alt="Banner"
          className="absolute inset-0 h-full w-full object-cover object-[35%_65%] dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
