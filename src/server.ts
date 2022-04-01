import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import {
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import { db } from './firebase';
import { LinksApiResponse, NextApiResponse } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const getOne = async () => {
  const linksCol = collection(db, 'links');
  const docs = await getDocs(
    query(linksCol, where('viewedAt', '==', null), limit(1)),
  );
  let doc;
  docs.forEach((_doc) => (doc = _doc));
  return doc;
};

app.get('/links', async (req: Request, res: Response<LinksApiResponse>) => {
  const linksCol = collection(db, 'links');
  const data = await getDocs(query(linksCol, where('viewedAt', '==', null)));
  const links: any[] = [];
  data.forEach((doc) => links.push(doc.data()));

  res.json({
    ok: true,
    links,
  });
});

app.get('/next', async (req: Request, res: Response<NextApiResponse>) => {
  const { keep } = req.query;
  const doc = await getOne();

  if (!doc) {
    return res.status(404).json({ ok: false, message: 'No further links' });
  }

  if (!keep) {
    await updateDoc(doc.ref, { viewedAt: serverTimestamp() });
  }

  res.json({
    ok: true,
    link: doc.data(),
  });
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
