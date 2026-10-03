/** Muestra un correo permitiendo que, si no cabe, se corte antes de la "@" (y no a mitad de palabra). */
export function EmailText({ email }: { email: string }) {
  const [user, domain] = email.split("@");
  return (
    <>
      {user}
      <wbr />@{domain}
    </>
  );
}
