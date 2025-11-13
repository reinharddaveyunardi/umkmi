"use client";

export default function Copyright() {
  return (
    <>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="footer-nama-web">UMKMi</span>. All rights reserved.
          Developed by{" "}
          <span className="footer-pembuat">Tim Pemuda Favorit</span>.
        </p>
      </footer>
    </>
  );
}
