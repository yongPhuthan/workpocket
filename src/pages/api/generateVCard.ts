import { NextApiRequest, NextApiResponse } from 'next'
import vCardsJS from 'vcards-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const vCardSample = vCardsJS();
  vCardSample.firstName = 'Giriraj';
  vCardSample.lastName = 'Pawar';
  vCardSample.workPhone = '+919960799799';
  vCardSample.email = 'GirirajP@frankcrum.com';
  vCardSample.title = 'Business';
  vCardSample.url = 'https://github.com/girirajpawar/iScan-Contact';
  vCardSample.note = 'Notes for Giri';

  const vCardString = vCardSample.getFormattedString();

  res.setHeader('Content-Type', 'text/vcard;charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=frankcrumteam_1.vcf');
  res.status(200).send(vCardString);
}
