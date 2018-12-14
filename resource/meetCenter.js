var Center = [];
var mapContainer = document.getElementById('map');
var mapOptions = {
    center: new daum.maps.LatLng(37.4876923, 126.8252203),
    level: 8
};
var map = new daum.maps.Map(mapContainer, mapOptions);
var geocoder = new daum.maps.services.Geocoder();
var ps = new daum.maps.services.Places();

daum.maps.event.addListener(map, 'click', function(mouseEvent) {
    // 클릭한 위치에 마커를 추가하는 함수
    myHome(mouseEvent.latLng);
});
var markers = [];
var iwContents = []; // 인포 윈도우 객체를 가지고 있을 배열
var markersPos = []; // marker의 위치만을 가지고 있을 배열

function enteraddress() {
    if (window.event.keyCode == 13) {
        AddressSearchBtn();
    }
}

function enterkey() {
    if (window.event.keyCode == 13) {
        PlaceSearchBtn();
    }
}

function AddressSearchBtn() {
    var keyword = document.getElementById("adddress");
    geocoder.addressSearch(keyword.value, AddressSearch);
}


function PlaceSearchBtn() {
    var keyword = document.getElementById("place");
    ps.keywordSearch(keyword.value, PlaceSearch);
}

function meetCenter () {
    if (markersPos.length < 2) {
        alert("최소 2곳 이상 선택해 주세요!");
    }
    else {
        // 중간지점 계산하기
        var sumLat = 0.0;
        var sumLng = 0.0;
        for (var i = 0;i < Number(markersPos.length);i++){
            sumLat += Number((markersPos[i].newLat * 1).toFixed(4));
            sumLng += Number((markersPos[i].newLng * 1).toFixed(4));
        }
        var imageSrc = 'https://raw.githubusercontent.com/icaros7/Meet-Here/master/resource/marker.png', // 마커이미지의 주소입니다
            imageSize = new daum.maps.Size(64, 64), // 마커이미지의 크기입니다
            imageOption = {offset: new daum.maps.Point(32, 62)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);
        var bounds = new daum.maps.LatLngBounds();
        var newPosLat = (sumLat / markersPos.length).toFixed(4);
        var newPosLng = (sumLng / markersPos.length).toFixed(4);
        var marker = new daum.maps.Marker({
            map: map,
            image: markerImage
        });

        var iwContent = new daum.maps.InfoWindow({
            position: new daum.maps.LatLng(newPosLat, newPosLng),
            content: "여기서 만나요!"
        });

        // 새로 submit 할 경우 기존 마커 제거
        if (Center.length === 1) {
            Center[0].setMap(null);
            Center.pop();
        }

        Center.push(marker);
        bounds.extend(new daum.maps.LatLng(newPosLat, newPosLng));
        marker.setPosition(new daum.maps.LatLng(newPosLat, newPosLng));
        iwContent.open(map, marker);
        marker.setMap(map);
        map.setBounds(bounds);
    }
}

function myHome(HomeLocation) {
    if ('address_name' in HomeLocation) {
        var marker = new daum.maps.Marker({
            map: map,
            position: new daum.maps.LatLng(HomeLocation.y, HomeLocation.x),
            draggable: false
        });

        var markerPos = { // 마커의 위치 정보
            newLat: HomeLocation.y,
            newLng: HomeLocation.x
        };
        var iwContent = new daum.maps.InfoWindow({
            position: new daum.maps.LatLng(HomeLocation.y, HomeLocation.x),
            content: (markersPos.length + 1) + "번째",
            removable: true
        });
    }
    else {
        var marker = new daum.maps.Marker({
            map: map,
            position: HomeLocation,
            draggable: false
        });

        var markerPos = { // 마커의 위치 정보
            newLat: HomeLocation.getLat().toFixed(4),
            newLng: HomeLocation.getLng().toFixed(4)
        };

        var iwContent = new daum.maps.InfoWindow({
            position: HomeLocation,
            content: (markersPos.length + 1) + "번째",
            removable: true
        });
    }

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
    iwContent.open(map, marker);
    // 생성된 마커를 배열에 추가합니다
    markers.push(marker);
    iwContents.push(iwContent);
    markersPos.push(markerPos);
}

function AddressSearch (data, status) {
    if (status === daum.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new daum.maps.LatLngBounds();
        myHome(data[0]);
        bounds.extend(new daum.maps.LatLng(data[0].y, data[0].x));
    }
    else {
        alert("잘못된 주소 입니다!");
    }
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

function PlaceSearch(data, status, pagination) {
    if (status === daum.maps.services.Status.OK) {
        var bounds = new daum.maps.LatLngBounds();
        myHome(data[0]);
        bounds.extend(new daum.maps.LatLng(data[0].y, data[0].x));
    }
    else {
        alert("잘못된 검색어 입니다!");
    }
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}