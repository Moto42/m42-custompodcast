const FeedData = require('./FeedData');
const DOMParser = require('xmldom').DOMParser;

//Mock data so we don't have to fetch from the database.
const mockData = {
  "doners": [
    "https://www.fakeaddy.com/feed"
  ],
  "feedID": "test",
  "title": "test podcast",
  "link": "https://www.fakeaddy.com",
  "description": "podcast description",
  "imgUrl": "https://www.fakeaddy.com/img.jpg",
  "explicit": false,
  "owner_name": "fake name",
  "owner_email": "fake@email.com",
  "category": "Technology",
  "items": [
    {
      "episodeNumber": 1,
      "title": "test 1",
      "description": "test description 1",
      "url": "https://www.fakeaddy.com/cast1.mp3",
      "pubDate":"Thu, 21 Dec 2016 16:01:07 +0000",
      "length": "11"
    },
    {
      "episodeNumber": 2,
      "title": "test 2",
      "description": "test description 2",
      "url": "https://www.fakeaddy.com/cast2.mp3",
      "pubDate":"Thu, 21 Dec 2016 16:01:07 +0000",
      "length": "22"
    },
    {
      "episodeNumber": 3,
      "title": "test 3",
      "description": "test description 3",
      "url": "https://www.fakeaddy.com/cast3.mp3",
      "pubDate":"Thu, 21 Dec 2016 16:01:07 +0000",
      "length": "33"
    }
  ]
}

describe('FeedData Object', () => {
  test('copies all data correctly', () => {
    const feedData = new FeedData(mockData);
    expect(feedData).toHaveProperty('feedID', 'test');
    expect(feedData).toHaveProperty('title', 'test podcast');
    expect(feedData).toHaveProperty('link', 'https://www.fakeaddy.com');
    expect(feedData).toHaveProperty('description', 'podcast description');
    expect(feedData).toHaveProperty('imgUrl', 'https://www.fakeaddy.com/img.jpg');
    expect(feedData).toHaveProperty('explicit', false);
    expect(feedData).toHaveProperty('owner_name', 'fake name');
    expect(feedData).toHaveProperty('owner_email', 'fake@email.com');
    expect(feedData).toHaveProperty('category', 'Technology');
    expect(feedData).toHaveProperty('doners',["https://www.fakeaddy.com/feed"]);
    expect(feedData).toHaveProperty('items');
    expect(Array.isArray(feedData.items)).toBeTruthy();
    expect(feedData.items.length).toBe(3);
    for(let i in feedData.items){
      const num = Number(i)+1;
      const item = feedData.items[i];
      expect(item.episodeNumber).toBe(num);
      expect(item.title).toBe("test "+num);
      expect(item.description).toBe("test description "+num);
      expect(item.url).toBe("https://www.fakeaddy.com/cast"+num+".mp3");
      expect(item.pubDate).toBe("Thu, 21 Dec 2016 16:01:07 +0000");
      expect(item.length).toBe(`${num}${num}`);
    }
  });
  test('defaults to good values', () => {
    const feedData = new FeedData(mockData);
    expect(feedData).toHaveProperty('feedID');
    expect(typeof feedData.feedID).toBe('string');
    expect(feedData).toHaveProperty('title');
    expect(typeof feedData.title).toBe('string');
    expect(feedData).toHaveProperty('link');
    expect(typeof feedData.link).toBe('string');
    expect(feedData).toHaveProperty('description');
    expect(typeof feedData.description).toBe('string');
    expect(feedData).toHaveProperty('imgUrl');
    expect(typeof feedData.imgUrl).toBe('string');
    expect(feedData).toHaveProperty('explicit');
    expect(typeof feedData.explicit).toBe('boolean');
    expect(feedData).toHaveProperty('owner_name');
    expect(typeof feedData.owner_name).toBe('string');
    expect(feedData).toHaveProperty('owner_email');
    expect(typeof feedData.owner_email).toBe('string');
    expect(feedData).toHaveProperty('category');
    expect(typeof feedData.category).toBe('string');
    expect(feedData).toHaveProperty('doners');
    expect(feedData).toHaveProperty('items');
    expect(Array.isArray(feedData.items)).toBeTruthy();
  });
});

describe('The RSS XML', () => {
  const dataXML = (new FeedData(mockData)).xml;
  const xml = (new DOMParser()).parseFromString(dataXML,'text.xml');

  test('has a channel title', () => {
    const titles = xml.getElementsByTagName('title');
    expect(
      Array.from(titles).findIndex(i => i.parentNode.tagName === 'channel')
    ).toBeGreaterThan(-1);
  });
  test('has a valid channel language', () => {
    const langs = xml.getElementsByTagName('language');
    expect(langs.length).toBe(1);
    const code = langs[0].firstChild.nodeValue;
    const validCodes = [
      'af',
      'sq',
      'eu',
      'be',
      'bg',
      'ca',
      'zh-cn',
      'zh-tw',
      'hr',
      'cs',
      'da',
      'nl',
      'nl-be',
      'nl-nl',
      'en',
      'en-au',
      'en-bz',
      'en-ca',
      'en-ie',
      'en-jm',
      'en-nz',
      'en-ph',
      'en-za',
      'en-tt',
      'en-gb',
      'en-us',
      'en-zw',
      'et',
      'fo',
      'fi',
      'fr',
      'fr-be',
      'fr-ca',
      'fr-fr',
      'fr-lu',
      'fr-mc',
      'fr-ch',
      'gl',
      'gd',
      'de',
      'de-at',
      'de-de',
      'de-li',
      'de-lu',
      'de-ch',
      'el',
      'haw',
      'hu',
      'is',
      'in',
      'ga',
      'it',
      'it-it',
      'it-ch',
      'ja',
      'ko',
      'mk',
      'no',
      'pl',
      'pt',
      'pt-br',
      'pt-pt',
      'ro',
      'ro-mo',
      'ro-ro',
      'ru',
      'ru-mo',
      'ru-ru',
      'sr',
      'sk',
      'sl',
      'es',
      'es-ar',
      'es-bo',
      'es-cl',
      'es-co',
      'es-cr',
      'es-do',
      'es-ec',
      'es-sv',
      'es-gt',
      'es-hn',
      'es-mx',
      'es-ni',
      'es-pa',
      'es-py',
      'es-pe',
      'es-pr',
      'es-es',
      'es-uy',
      'es-ve',
      'sv',
      'sv-fi',
      'sv-se',
      'tr',
      'uk',
    ] //array of all codes
    expect(validCodes.includes(code)).toBeTruthy();
  });
  test('has a channel description', () => {
    const descriptions = xml.getElementsByTagName('description');
    expect(
      Array.from(descriptions).findIndex(i => i.parentNode.tagName === 'channel')
    ).toBeGreaterThan(-1);
  });
  test('has a channel link', () => {
    const links = xml.getElementsByTagName('link');
    expect(
      Array.from(links).findIndex(i => i.parentNode.tagName === 'channel')
    ).toBeGreaterThan(-1);
  });
  describe('has valid image tag', () => {
    test('has a channel image', () => {
      const images = xml.getElementsByTagName('image');
      expect(
        Array.from(images).findIndex(i => i.parentNode.tagName === 'channel')
      ).toBeGreaterThan(-1);
    });
    const images = xml.getElementsByTagName('image');
    const image = Array.from(images).find(i => i.parentNode.tagName === 'channel');
    test('image > url', () => {
      expect(image.getElementsByTagName('url').length).toBe(1);
    });
    test('image > title', () => {
      expect(image.getElementsByTagName('title').length).toBe(1);
    });
    test('image > link', () => {
      expect(image.getElementsByTagName('link').length).toBe(1);
    });
  });
  test('has a channel itunes:image', () => {
    const images = xml.getElementsByTagName('itunes:image');
    expect(
      Array.from(images).findIndex(i => i.parentNode.tagName === 'channel')
    ).toBeGreaterThan(-1);
  });
  test('has an itunes:explicit tag', () => {
    const tags = xml.getElementsByTagName('itunes:explicit')
    expect(tags.length).toBe(1);
  });
  test('itunes:explicit tag is boolean', () => {
    const tag = xml.getElementsByTagName('itunes:explicit')[0].lastChild.nodeValue;
    expect(['yes','no'].includes(tag)).toBeTruthy();
  });
  test('has a channel itunes:category', () => {
    const categorys = xml.getElementsByTagName('itunes:category');
    expect(
      Array.from(categorys).findIndex(i => i.parentNode.tagName === 'channel')
    ).toBeGreaterThan(-1);
  });
  describe('has valid itunes:owner', () => {
    const owners = xml.getElementsByTagName('itunes:owner');
    test('itunes:owner exists', () => {
      expect(
        Array.from(owners).findIndex(i => i.parentNode.tagName === 'channel')
      ).toBeGreaterThan(-1);
    });
    const owner = Array.from(owners).find(i => i.parentNode.tagName === 'channel');
    test('itunes:owner > itunes:name', () => {
      expect(owner.getElementsByTagName('itunes:name').length).toBe(1);
    });
    test('itunes:owner > itunes:email', () => {
      expect(owner.getElementsByTagName('itunes:email').length).toBe(1);
    });
  });

  describe('Validating the items (episodes)', () => {
    const items = Array.from(xml.getElementsByTagName('item'));
    test('at least one item exists', () => {
      expect(items.length).toBeGreaterThan(0);
    });
    for(let i in items){
      const item = items[i];
      describe(`item ${i}`, () => {
        test('item > title', () => {
          expect(item.getElementsByTagName('title').length).toBe(1);
        });
        test('item > description', () => {
          expect(item.getElementsByTagName('description').length).toBe(1);
        });
        test('item > pubDate', () => {
          expect(item.getElementsByTagName('pubDate').length).toBe(1);
        });
        const enclosures = item.getElementsByTagName('enclosure');
        test('item > enclosure', () => {
          expect(enclosures.length).toBe(1);
        });
        if(item.getElementsByTagName('enclosure').length === 1){
          const enclosure = enclosures[0];
          test('enclosure.url', () => {
            expect(enclosure.hasAttribute('url')).toBeTruthy();
          });
          test('enclosure.type', () => {
            expect(enclosure.hasAttribute('type')).toBeTruthy();
            expect(enclosure.getAttribute('type')).toBe('audio/mpeg');
          });
          test('enclosure.length', () => {
            expect(enclosure.hasAttribute('length')).toBeTruthy();
          });
        }
      });
    }

  });


});
