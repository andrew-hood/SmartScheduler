import { globalCSS } from "@go1d/go1d";
import { extractCritical } from "emotion-server";
import Document, { Head, Html, Main, NextScript } from "next/document";

globalCSS();

export default class extends Document<any> {
  public static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);
    return { ...initialProps, ...styles };
  }

  public globalCss = `
    body {
      background: #F7F8F8;
    }`;

  public render() {
    return (
      <Html lang="en-US">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <style dangerouslySetInnerHTML={{ __html: this.globalCss }} />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
