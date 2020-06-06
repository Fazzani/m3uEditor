import fetch from 'isomorphic-fetch';
import fs from 'fs';

interface Dictionary<T> {
  [key: string]: T;
}

export class Row {
  public Name: string | undefined;
  public Url: string | undefined;
  public Properties: Dictionary<string>;

  constructor(name: string = '', url: string = '', properties: Dictionary<string>) {
    this.Name = name;
    this.Url = url;
    this.Properties = properties;
  }
}

export class Playlist {
  public Name: string;
  public Location: string;
  public Rows: Row[] | undefined;

  constructor(name: string, location: string, rows: Row[] | undefined) {
    this.Name = name;
    this.Location = location;
    this.Rows = rows;
  }

  static STREAM_META_PREFIX: string = '#EXTINF:-1';
  static STREAM_META_HEADER_FILE: string = '#EXTM3U';

  public static CreatePlaylist(url: string, lines: string[], name: string = ''): Playlist {
    let pl: Playlist = new Playlist('', url, new Array<Row>());
    let row: Row | undefined;

    for (const [index, line] of lines.entries()) {
      if (line.length === 0 || line.startsWith(Playlist.STREAM_META_HEADER_FILE)) {
        continue;
      }
      if (line.startsWith(Playlist.STREAM_META_PREFIX)) {
        let tab1 = line.slice(Playlist.STREAM_META_PREFIX.length).trim().split(',');
        let dictMeta: Dictionary<string> = {};
        tab1[0]
          .split('="')
          .flatMap((x) => {
            if (x.indexOf('" ') >= 0) return x.split('" ');
            return x;
          })
          .map((e: string, i: number, a: string[]) => {
            if (i % 2 == 0) {
              // return { key: e?.trim(), value: a[i + 1]?.trim() };
              dictMeta[e?.trim()] = a[i + 1]?.trim();
            }
          })
          .filter((x) => x !== undefined);

        row = new Row(tab1[1].trim(), '', dictMeta);
      } else if (row != undefined) {
        row.Url = line;
        pl.Rows?.push(row);
      }
    }

    return pl;
  }
  /**
   * Read From Url
   */
  public static async ReadFromUrl(url: string): Promise<Playlist> {
    if (url == undefined || url === '') throw new Error('Argument Exception');
    var regex = /^https?:\/\/(.*)$/g;
    if (!regex.test(url)) throw new Error('Argument Exception');

    let res = await fetch(url);
    let lines = (await res.text()).split(/\r?\n/);
    return Playlist.CreatePlaylist(url, lines);
  }

  /**
   * Read From File
   */
  public static async ReadFromFile(path: string): Promise<Playlist> {
    let res = await fs.promises.readFile(path, 'utf8');
    console.log(res);
    let lines = res.split(/\r?\n/);
    return Playlist.CreatePlaylist(path, lines);
  }
}
