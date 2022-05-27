import * as otplib from 'otplib';
import { otp } from 'src/auth/types';

/**
 * otplib configuration
 */
const otpConfig: otp = {
  window: 300,
  digits: 6,
  step: 1,
};

otplib.authenticator.options = otpConfig;

export default otplib;
