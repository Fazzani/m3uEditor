import { Playlist, Row } from "../models/row";

const plUrl: string =
  "https://gist.githubusercontent.com/Fazzani/722f67c30ada8bac4602f62a2aaccff6/raw/0b75e84d15b955f7073cb0225e7919a03347d8e9/playlist1.m3u";

describe("Test Playlist argument exception", () => {
  test("should argument exception", () => {
    expect(async () => await Playlist.ReadFromUrl("")).rejects.toThrow(
      new Error("Argument Exception")
    );
  });
  test("should argument exception", () => {
    expect(async () => await Playlist.ReadFromUrl("qsd")).rejects.toThrow(
      new Error("Argument Exception")
    );
  });
  test("should not throw  argument exception", () => {
    expect(
      async () => await Playlist.ReadFromUrl("http://test")
    ).rejects.not.toThrow(new Error("Argument Exception"));
  });
  test("should not throw  argument exception", () => {
    expect(
      async () => await Playlist.ReadFromUrl("https://test.m3u")
    ).rejects.not.toThrow(new Error("Argument Exception"));
  });
});

describe("Test read Playlist url", () => {
  const sayCreatePlaylist = jest.spyOn(Playlist, "CreatePlaylist");
  test("should CreatePlaylist called once", async () => {
    await Playlist.ReadFromUrl(plUrl);
    expect(sayCreatePlaylist).toHaveBeenCalledTimes(1);
  });
});

describe("Test read Playlist OK", () => {
  test("should read", async () => {
    const pl: Playlist = <Playlist>await Playlist.ReadFromUrl(plUrl);
    expect(pl).not.toBeNull();
    expect(pl.Location).not.toBeNull();
    expect(pl.Rows?.length).toBe(96);
  });
});
