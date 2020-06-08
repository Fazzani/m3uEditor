import 'isomorphic-fetch';
import fs from 'fs';

interface Dictionary<T> {
  [key: string]: T;
}

interface Checked {
  checked: boolean;
}
export class Row implements Checked {
  public Name: string | undefined;
  public Url: string | undefined;
  public Properties: Dictionary<string>;
  public checked: boolean = false;

  constructor(name: string = '', url: string = '', properties: Dictionary<string> = {}) {
    this.Name = name;
    this.Url = url;
    this.Properties = properties;
  }
}

export class Playlist {
  public Name: string;
  public Location: string;
  public Rows: Row[];

  constructor(name: string, location: string, rows: Row[] = []) {
    this.Name = name;
    this.Location = location;
    this.Rows = rows;
  }

  static STREAM_META_PREFIX: string = '#EXTINF:-1';
  static STREAM_META_HEADER_FILE: string = '#EXTM3U';

  public static CreatePlaylist(url: string, lines: string[], name: string = ''): Playlist {
    const pl: Playlist = new Playlist('', url, new Array<Row>());
    let row: Row = new Row('', '');

    for (const [index, line] of lines.entries()) {
      if (line.length === 0 || line.startsWith(Playlist.STREAM_META_HEADER_FILE)) {
        continue;
      }
      if (line.startsWith(Playlist.STREAM_META_PREFIX)) {
        const tab1 = line.slice(Playlist.STREAM_META_PREFIX.length).trim().split(',');
        const dictMeta: Dictionary<string> = {};
        tab1[0]
          .split('="')
          .flatMap((x) => {
            if (x.indexOf('" ') >= 0) return x.split('" ');
            return x;
          })
          .map((e: string, i: number, a: string[]) => {
            if (i % 2 == 0) {
              dictMeta[e?.trim()] = a[i + 1]?.trim();
            }
          })
          .filter((x) => x !== undefined);

        row = new Row(tab1[1].trim(), '', dictMeta);
      } else if (row !== undefined) {
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
    if (url === undefined || url === '') throw new Error('Argument Exception');
    const regex = /^https?:\/\/(.*)$/g;
    if (!regex.test(url)) throw new Error('Argument Exception');

    const res = await fetch(url);
    const lines = (await res.text()).split(/\r?\n/);
    return Playlist.CreatePlaylist(url, lines);
  }

  /**
   * Read From File
   */
  public static async ReadFromFile(path: string): Promise<Playlist> {
    console.log(`Reading from file ${path}`)
    const res = await fs.promises.readFile(path, 'utf8');
    const lines = res.split(/\r?\n/);
    return Playlist.CreatePlaylist(path, lines);
  }
}
