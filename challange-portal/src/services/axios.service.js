import axios from 'axios';

export const GetImage = async (e) => {
  return await axios({
    method: 'post',
    url: `${process.env.REACT_APP_TWILIO_HOST}/image`,
    data: {
      identity: e,
    },
  }).then((res) => res.data);
};
