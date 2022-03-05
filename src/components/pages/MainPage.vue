<template>
  <div id="app">
    <v-snackbar
        v-model="snackbar"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
            icon
            v-bind="attrs"
            @click="snackbar = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- 初始化地圖設定 -->
    <l-map
        ref="myMap"
        :zoom="zoom"
        :center="center"
        :options="options"
        style="height: 100vh"
        @contextmenu="openContextMenu"
    >

      <l-layer-group ref="newLayerGroup" class="leaflet-popup-content">
        <l-popup>
          <div>
            <v-text-field :value="locationToAdd.lat.toFixed(5)+','+locationToAdd.lng.toFixed(5)"
                          disabled
            >

            </v-text-field>
            <v-dialog
                v-model="dialog"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    small
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <!--@click="showLocationModalMethod"-->
                  <v-icon dark>
                    mdi-map-marker-plus
                  </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Add Location
                </v-card-title>
                <v-form ref="add_location_form">
                  <v-text-field
                      v-model="locationToAdd.address"
                      label="address"
                      :rules="inputRules"
                  ></v-text-field>
                  <v-text-field
                      v-model="locationToAdd.ownerName"
                      label="ownerName"
                      :rules="inputRules"
                  ></v-text-field>
                  <!--                <v-divider></v-divider>-->

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="#BDBDBD"
                        @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="addLocation"
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </div>
        </l-popup>
      </l-layer-group>
      <!-- 載入圖資 -->
      <l-tile-layer :url="url" :attribution="attribution"/>
      <!-- 自己所在位置 -->
      <l-marker ref="location" :lat-lng="center">
        <l-popup>
          你的位置
        </l-popup>
      </l-marker>
      <!-- 創建標記點 -->
      <l-marker :lat-lng="item.local" v-for="item in location_data" :key="item.id" @click="clickMarker(item)">
        <!-- 標記點樣式判斷 -->
        <l-icon
            :icon-url="item.address === '夢時代購物中心'?icon.type.gold:icon.type.black"
            :shadow-url="icon.shadowUrl"
            :icon-size="icon.iconSize"
            :icon-anchor="icon.iconAnchor"
            :popup-anchor="icon.popupAnchor"
            :shadow-size="icon.shadowSize"

        >


        </l-icon>
        <!-- 彈出視窗 -->
        <!--        <l-popup>-->
        <!--          <p>-->
        <!--            address: {{ item.address }}-->
        <!--          </p>-->
        <!--          <p>-->
        <!--            owner name: {{ item.ownerName }}-->
        <!--          </p>-->
        <!--          <p>-->
        <!--            <b-button @click="showRatingModalMethod">add rating data</b-button>-->
        <!--          </p>-->
        <!--          <p v-for="data in item.ratings" :key="data.id">-->
        <!--            rating: {{ data.rating }}-->
        <!--            comment: {{ data.comment }}-->
        <!--          </p>-->
        <!--        </l-popup>-->
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import {getUserName} from "@/utils/auth";
import {location_api} from "@/api";
import axios from "axios";
// import ContextMenu from './ContextMenu';


export default {
  name: "App",
  // components: {ContextMenu},

  data() {
    return {
      snackbar: false,
      message: '',
      inputRules: [
        v => !!v || 'This field is required',
      ]
      ,
      dialog: false,
      locationToAdd: {
        country_name: '',
        country_id: 0,
        address: '',
        ownerName: '',
        lat: 0,
        lng: 0
      },
      ratingToAdd: {
        location_id: 0,
        rating: 0,
        comment: ''
      },
      showContextMenu: false,
      showModal: false,

      zoom: 13,
      center: [22.612961, 120.304167],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: `© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`,
      options: {
        // zoomControl: false,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
          text: 'Show coordinates',

        }, {
          text: 'Center map here',

        }, '-', {
          text: 'Zoom in',
          icon: 'images/zoom-in.png',

        }, {
          text: 'Zoom out',
          icon: 'images/zoom-out.png',

        }]
      },
      icon: {
        type: {
          black:
              "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
          gold:
              "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png"
        },
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }
    };
  },
  methods: {
    showSnackBar(message){
      this.snackbar = true
      this.message = message
    },
    addMarker(event) {
      console.log(event.latlng);
    },
    openContextMenu(event) {
      // console.log(event.latlng);
      this.$refs.newLayerGroup.mapObject.openPopup(event.latlng);
      this.locationToAdd.lat = event.latlng.lat;
      this.locationToAdd.lng = event.latlng.lng;
      let open_street_api = axios.create({
        baseURL: 'https://nominatim.openstreetmap.org', headers: {
          'Content-Type': 'application/json',
        }
      })
      open_street_api.get(`reverse?format=jsonv2&lat=${this.locationToAdd.lat}&lon=${this.locationToAdd.lng}`)
          .then(res => {
            this.locationToAdd.country_name = res.data.address.country
            let auto_address = ''
            if (res.data.address.city !== undefined) {
              auto_address += res.data.address.city
            }
            if (res.data.address.town !== undefined) {
              auto_address += res.data.address.town
            }
            if (res.data.address.road !== undefined) {
              auto_address += res.data.address.road
            }
            this.locationToAdd.address = auto_address
            console.log(res.data.address)
            location_api.get('countries')
                .then(res => {
                  res.data.forEach(element => {
                    if (element.name === this.locationToAdd.country_name) {
                      this.locationToAdd.country_id = element.id
                    }
                  })
                })
          })
          .catch(err => {
            console.log(err.response)
          })
    },
    addLocation() {
      if (this.$refs.add_location_form.validate()) {
        location_api.post('locations', {
          country_id: this.locationToAdd.country_id,
          address: this.locationToAdd.address,
          owner_name: this.locationToAdd.ownerName,
          lat: this.locationToAdd.lat,
          lng: this.locationToAdd.lng
        })
            .then(res => {
              let element = {
                id: res.data.id,
                address: this.locationToAdd.address,
                local: [this.locationToAdd.lat, this.locationToAdd.lng],
                ownerName: this.locationToAdd.ownerName,
                ratings: []
              }
              this.$store.dispatch('location/add_location', element)
              this.dialog = false
              this.showSnackBar('Add location successfully.')
            })
      }
    },
    clickMarker(location) {
      this.$emit('markerClicked', location)
      this.ratingToAdd.location_id = location.id
    }
  },
  computed: {
    username() {
      return getUserName()
    },
    location_data() {
      return this.$store.getters['location/location_data']
    },
  },

  mounted() {
    // 等地圖創建後執行
    this.$nextTick(() => {
      // 獲得目前位置
      navigator.geolocation.getCurrentPosition(position => {
        const p = position.coords;
        // 將中心點設為目前的位置
        this.center = [p.latitude, p.longitude];
        // 將目前的位置的標記點彈跳視窗打開
        this.$refs.location.mapObject.openPopup();
      });
      this.$store.dispatch('location/clear_locations')
      //將db中的location資料放到data中
      location_api.get('/locations')
          .then(res => {
            res.data.forEach(element => {
              location_api.get('/ratings?location_id=' + element.id)
                  .then(res => {
                    let location_to_add = {
                      id: element.id,
                      ratings: res.data,
                      address: element.address,
                      local: [element.lat, element.lng],
                      ownerName: element.owner_name
                    };
                    this.$store.dispatch('location/add_location', location_to_add)
                  })
            })
          })
    });
  }
};
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}

.leaflet-popup-content {
  max-width: 2000px;
  min-width: 180px;
  height: 100px;
  /*overflow-y: scroll;*/
}
</style>