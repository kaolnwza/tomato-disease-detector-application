import {
  Image,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Button, ListItem, Avatar} from '@rneui/themed';
const Information = ({navigation}) => {
  const list = [
    {
      name: 'โรคใบจุด',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Bacterial_spot/00728f4d-83a0-49f1-87f8-374646fcda05___GCREC_Bact.Sp%206326.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221215%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221215T150528Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=48e6b3ff86508181d272fe350711a3d7450f26140d6f6bc6ac9c836c04b42c7658b6ec7c643c4064e0bf7076e31f5b0b6f654514d6ff601d7066daf2aeff582b926d81433e79abfaf2ffb46cf2921562954e9ee04a000a520aca4d3d3bbe22769942d3d77ec9075c0fd29edd11892fe772a7a26f79e8360e97439b8f3313c398a6b89788c981377788c028e77f3a55d7846699c2236c166615ab87e5b31b839619577ff75ebba047c5321558bcfd50201a2d4ddbb6c6840330e67269d630c7fdefd60cc4c44a0abc4759780d558a80988b696b2cd83e62189300d97e4efe459d0e0328a2a7903f3ce9bd5a40aba94cd5d7a12e787554838cae24ee1a4ad9b83a',
      subtitle: 'Bacterial Spot',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'โรคใบจุดวง',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Early_blight/0012b9d2-2130-4a06-a834-b1f3af34f57e___RS_Erly.B%208389.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221217%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221217T060139Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=03c63e7bbd491ead97946f520fe8556c19031d36554eeade82f249b6563493817452dc0b42859ef16a39bf13d519264f40f105dadb7c4f2f4ead0ce57b06507a58d6f039a16b9cfb3b06d5d7dd5484c62f2e3d389f5d23342979510860da4ee343793a486d2e8cec827327726e4b48034530981bf8693e98bf914f570a74e80737f9c8006b93bdc1fe9b86286b0a0e813dcbadda16fb01848ea3190d7908b9ac7b9e25ef0cfbc61cf4bfa985093b8d06bbd60a510bdbbf4ac6472bf79fe7d89202f4eb92be8a0ed17802a587356850c7c91a455ba5f34eaf9e8434e27b853334b616f93fee6bddcdd4f27c92a5b51405e0b75f108260281420e64cf5bf943a93',
      subtitle: 'Early Blight',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'โรคใบไหม้',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Late_blight/00355ec2-f12c-4015-b8f9-94354f69ce22___RS_Late.B%205311.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221218T054003Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=54cab01a10f3f186c32ba158395bb4e885472ca02e8a746d9e13dd580c6cf6bfddd806db9aa15a68de9db3dd4b69cb232363cd4da0a04d7481849d121a34d1b2e67f4884cd07e41f1f7081c481f917d549ac0a9a1c89502b2f63422ccec6499e0e7d186cc96b34d9c5d25ef1ddf5efaa55d8c82f9ad6aef0efb7700864c5052de132bae102a52fd278c965ae0a6a9a2a29b61c7c5910a1cac014696b8336abe00c8c16c960d65d0757e8e2f6d02c2ca049c8ff4e3bcdce1def2537031347d19c3ab36fe53dacda5624d888b1efc6ae949737d62cad63f4b3313722ca8159f7698aa97d7311c2fb269a08740673eb4989f36272adf08f17e7c9b7f0cc065fd29d',
      subtitle: 'Late Blight',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'โรครากำมะหยี่',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Leaf_Mold/0160c3b5-d89e-40e5-a313-49ae1524040a___Crnl_L.Mold%206823.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221215%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221215T053843Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=17007403797bf8133101223ece80c30d615262ba7e74ddcaa9a10d761bcb0d9e9cc86c443240b6fec5c257dc4e3432ee016789542f029564c6ecfd8cdfbbe6777a674a1e5b44483026d523d334cd0d820e243a63728328c4524021a63b9666f8e53b08a3bdf1dc0a4f65683d45640f6c93265fd0bf2eba7d0e1ab8079af92decbe15b39c6f626a1cf62bc6664e1bdb65a721546b509de5bc9b048c806bcb74aa167d2fb1fa00d63fb67d300273c1f8e9d99d325bc9dfe62c78895b1ee5cf0eb34a427c6e1dee7c3f487c133a621dd78452d83e8bc2feb5d27b215aca72a43244db45e03b7ade2ad7fd6ec2edae58c19fab09952d271a8d48982fc5fe68ddf990',
      subtitle: 'Leaf Mold',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'โรคใบจุดวงกลม',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Septoria_leaf_spot/002533c1-722b-44e5-9d2e-91f7747b2543___Keller.St_CG%201831.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221218T054512Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=3b0219f4d801230ef02d1be4342a5b7d00aa72dd90931e1da91ddc77edebbe10afd63684ccce8f1f78d005a3952f7a34dfd3ba74f4ad115a8508c5cb5172ac003c90e96c32ce880eba22bc9f510353e4706ae929d69ee2ab55850b06613ca210bee04e5f8e3769badeb05b43a8ed175a57a7a7b4283aae8050987b8e71b64c2badb9cce777a43677544cbd4354fe5d39029bd50264aa34da05f4af7a39780d988900b423bba3c6b800ab9ba11dabb909ef6636f92d3c70d44a938ab5304526b4bf105421706c29d57f854ea85890f67b273bb25980d1d1b950c2086f2d0078aa9fce9aa90118f2f26429922b33feb4326624dbac3f3ee06dac2705055a26651f',
      subtitle: 'Septoria Leaf Spot',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'ไรสองจุด',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Spider_mites%20Two-spotted_spider_mite/003b7929-a364-4e74-be1c-37c4c0a6ec63___Com.G_SpM_FL%201414.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221218T052404Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=39f677e218eff104734d37f80692815e31cf4dacd90dec21d8b33b9bf63369f34c8fb5299208447057194b33d8cacfef2423f319e5efb40a27614e7172b82f5ba54b5220ee83f63df69adc54e8bdc949a9506db2444248a96b4bacba8b305d9c58b7f03b6faabb0dc3507578c89e83aa385d7dc943f7cfb046e280f4afa69bfea6d16c5bb7283d772fd1beac63300cc0a6ac2a9bf27ef96bbfd0e9808319d9b9e65a957014145267732f11a662f92dc9a7ec7bacd61439acfc83fd2ae382808f4052840cf5e6500e7e5909e36ebdd718a2a7d6f362e1d47e25d9dc99bd3dd183a85a3e9d5c489772d69e5f4e2e163bb2ff02a793d7f88ce174ca113734d766db',
      subtitle: 'Two-spotted Spider Mite',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'โรคใบหงิกเหลือง',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Tomato_Yellow_Leaf_Curl_Virus/0036c89d-7743-4895-9fcf-b8d2c1fc8455___YLCV_NREC%200313.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221218T054739Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=b9c93b230a131b83ba66e97c19ae3daf77ace33d0bc7427c60236cf322fabd98e52c5c6d4f68cf40a5717ce4b682def3016042d8bac255921027d962c885a559613eaafe5f1589e22a243f5a3b8693cddb92c3670a1080e87578b6328e90851c3b89074f36122a4c06baa469e97ae434ef5e49c70d7800cdbbbbd8902f72e687d64d71d65f1558e8719645135068997c804c67edb64efa19d5e7a2a4647b19c8379aaaa37e4fcab443937c8052b45fe7147c9c6f021cad1cbef695693ee89c766122b2f415971857ade390b9d945067048c48b9581b0c3ab298addfdd7ba9d170bdff00f2caf6ec513355637561247db3e006cbaff2d251901855755a61dad2f',
      subtitle: 'Yellow Leaf Curl Virus',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
    {
      name: 'โรคใบด่าง',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Tomato_mosaic_virus/02cb8c4e-4542-4020-bb46-025de54d97ae___PSU_CG%202098.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221218T055455Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=b18c8f78c31b48482b388dbc9a1dd95b5e42adbd8b0d46512ca244a97bbb3996e0c25e3ab7c639c6ea478422c6cfe329bf9cd8f3bf47f5d8eb4e3cca3426fa155e29526f785353e936205c61a7f8fb26aa34a06e8a3fd70f5bd43002c99be75f719c8a18e37691b5806116ee73ba1d3036d3641ac13cf6cfef9eb321e823e93706d4524b40f0d8818a2b4a1bb618cbaec732a4b0fa0e6a7d0eb08a8aeb136d3b1eeb6c308e5f9d091a1e7efbf2246290d8fdf29a3f27c855450ba5a031d74ab0469151fb669298afec4c8338d83cf463f76ccfb83b203c75a5f09b9066b2d093219caef77b094e151065ab85e3c77e13f3258c0a8b43c9ed84d7091c9bb58e8b',
      subtitle: 'Mosaic virus',
      inform: [
        {
          title: 'ข้อมูลโรค',
          icon: 'virus',
          data: [
            {
              title: 'สาเหตุ',
              icon: 'alert-circle-outline',
              data: 'โรคใบจุดมะเขือเทศมีสาเหตุเกิดจากเชื้อแบคทีเรีย (GenusXanthomonas) โรคนี้พบได้ในแหล่งปลูกมะเขือเทศและพริกทั่วโลก โดยเฉพาะในเขตสภาพอากาศร้อนชื้น',
            },
            {
              title: 'อาการ',
              icon: 'leaf',
              data: 'เกิดแผลคล้ายรอยไหม้ ส่วนใบที่ติดโรคอย่างรุนแรงจุดที่เป็นแผลจะเปลี่ยนเป็นสีเหลือง',
            },
            {
              title: 'การแพร่ระบาด',
              icon: 'virus-outline',
              data: 'เชื้อสาเหตุโรคนี้สามารถติดมากับเมล็ดพันธุ์ได้ ส่วนการระบาดในแปลงจะเกิดได้ รุนแรงและรวดเร็วเมื่อมีความชื้นและอุณหภูมิสูง',
            },
          ],
        },
        {
          title: 'การป้องกัน',
          icon: 'shield-check-outline',
          data: [
            ' 1. คลุกเมล็ดด้วยสารป้องกันกำจัดโรคพืชที่สามารถกำจัดเชื้อสาเหตุที่ติดมากับ เมล็ดพันธุ์ได้ เช่น แมนโคเซบ ไอโพรไดโอน',
            '2. ถ้าระบาดในแปลงปลูก พ่นด้วยสารป้องกันกำจัดโรคพืชบางชนิด เช่น ไอโพรไดโอน คลอโรทาโลนิล',
          ],
        },
      ],
    },
  ];

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Detail', {item});
      }}>
      <ListItem bottomDivider containerStyle={{backgroundColor: '#00000000'}}>
        <Avatar
          rounded
          size={60}
          source={item.avatar_url && {uri: item.avatar_url}}
          title={<ActivityIndicator />}
        />

        <ListItem.Content>
          <ListItem.Title style={{fontFamily: 'Kanit-Regular'}}>
            {item.name}
          </ListItem.Title>
          <ListItem.Subtitle style={{fontFamily: 'Kanit-Regular'}}>
            {item.subtitle}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#F0F9F8',
  },
});
export default Information;
