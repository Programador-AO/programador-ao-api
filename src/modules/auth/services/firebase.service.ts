import { initializeApp } from 'firebase/app';
import { Injectable } from '@nestjs/common';
import { initializeApp as initializeAppAdmin, cert } from 'firebase-admin/app';

import firebaseConfig from '../../../config/firebase.config';

@Injectable()
export class FirebaseService {
  public initApp() {
    return initializeApp(firebaseConfig());
  }

  public initAdmin() {
    return initializeAppAdmin({
      credential: cert('../../../../programador-ao-firebase-adminsdk.json'),
    });
  }
}
