import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { TowerDetailsService } from '../../providers/tower-detail.service'; 
import { towermesh } from './towermesh';
import { IBuildingValues } from 'src/shared/interfaces/IBuildingValues';
import { IProjectValues } from 'src/shared/interfaces/IProjectValues';

//ThreeJS component structure.
//https://github.com/makimenko/angular-three-examples

@Component({
  selector: 'app-tower-detail',
  templateUrl: './tower-detail.component.html',
  styleUrls: ['./tower-detail.component.css']
})
export class TowerDetailComponent implements AfterViewInit {

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    public scene: THREE.Scene;

    public fieldOfView: number = 60;
    public nearClippingPane: number = 1;
    public farClippingPane: number = 2000;

    public controls: OrbitControls;
    public INTERSECTED: any;

    //Building Properties
    public buildingValues = {} as IBuildingValues;
    public projectValues = {} as IProjectValues;
    //Project Properties
   
    public showApartmentLabel: boolean = false;
    public buildingwithBuildingInstances: any;
    public defaultBuildingInstances: any = []; 
    //public defaultBuildingInstances: any; 

    public podium01_s: any;
    public podium02_s: any;
    public podium03_s: any;
    public podium04_s: any;
    public podium05_s: any;
    public podium06_s: any;
    public podium07_s: any;
    public podium08_s: any;
    public podium09_s: any;
    public podium10_s: any;
    public podium11_s: any;
    public podium12_s: any;
    public podium13_s: any;
    public podium14_s: any;
    public podium15_s: any;
    public podium16_s: any;
    public podium17_s: any;
    public tower01_s: any;
    public tower02_s: any;
    public tower03_s: any;
    public tower04_s: any;
    public tower05_s: any;
    public tower06_s: any;
    public tower07_s: any;
    public tower08_s: any;
    public tower09_s: any;
    public tower10_s: any;

    public tower07_lMesh: any;
    public tower08_lMesh: any;
    public tower09_lMesh: any;
    public tower10_lMesh: any;

    @ViewChild('canvas')
    private canvasRef: ElementRef;

    constructor(private towerDetailService: TowerDetailsService) {

        this.projectValues.projIRR = 0;
        this.projectValues.projhar = 0;
        this.projectValues.projmoc = 0;
        this.projectValues.projrolIRRValue = '';
        this.projectValues.projIRRValue = '';
        this.projectValues.projharValue = '';
        this.projectValues.projMocValue = '';

        this.buildingValues.towerName = '';
        this.buildingValues.type = '';
        this.buildingValues.apartments = 0;
        this.buildingValues.height = 0;
        this.buildingValues.floors = 0;
        this.buildingValues.har = '';
        this.buildingValues.grossFloorArea = 0;
        this.buildingValues.efficiency = '';

        this.render = this.render.bind(this);
        this.onModelLoadingCompleted = this.onModelLoadingCompleted.bind(this);

        
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    calculate(): void{

        var filteredBuilding = this.buildingwithBuildingInstances.buildings.filter(b => b.buildingName === this.buildingValues.towerName );
        console.log(filteredBuilding);
        var buildingType = this.buildingValues.floors <= 10 ? "S" : this.buildingValues.floors <= 20 ? "M" : "L";
        //var bi = filteredBuilding[0].buildingInstances.filter(f => f.size === buildingType);

        //call API
        this.towerDetailService.GetBuildingInstanceBySize(filteredBuilding[0].buildingId, buildingType)
            .subscribe(bi => {              
                
                
                var newMesh = this.buildBIMeshWithProperties(filteredBuilding[0], bi);
                var buildingName = filteredBuilding[0].buildingName;
                if(buildingName === "Tower07"){
                    this.scene.remove(this.tower07_lMesh);
                    this.tower07_lMesh = newMesh;
                    this.scene.add(newMesh);
                }
                else if(buildingName === "Tower08"){
                    this.scene.remove(this.tower08_lMesh);
                    this.tower08_lMesh = newMesh;
                    this.scene.add(newMesh);
                }
                else if(buildingName === "Tower09"){
                    this.scene.remove(this.tower09_lMesh);
                    this.tower09_lMesh = newMesh;
                    this.scene.add(newMesh);
                }
                else if(buildingName === "Tower10"){
                    this.scene.remove(this.tower10_lMesh);
                    this.tower10_lMesh = newMesh;
                    this.scene.add(newMesh);
                }
                
                var parsedCa = JSON.parse(bi[0].caJson);
                this.buildingValues.floors = parsedCa.Floors;
                this.buildingValues.height = parsedCa.Height;
                this.buildingValues.apartments = parsedCa.Apartments;
                this.buildingValues.har = Math.round(parsedCa.Affordable_Housing_Ratio * 100*100)/100 + '%';;
                this.buildingValues.grossFloorArea = parsedCa.GFA;
                this.buildingValues.efficiency = Math.round(parsedCa.Efficiency * 100*100)/100 + '%';
        
                this.RecalculateProjectData(this.buildingwithBuildingInstances.buildings);
        

            });
        // var oldTrueRecord = filteredBuilding[0].buildingInstances.filter(f => f.isDefault === true);
        // var oldTrueIndex = filteredBuilding[0].buildingInstances.indexOf(oldTrueRecord[0]);
        // filteredBuilding[0].buildingInstances[oldTrueIndex].isDefault = false;
        
        // var index = filteredBuilding[0].buildingInstances.indexOf(bi[0]);
        // filteredBuilding[0].buildingInstances[index].isDefault = true;
        
        // var newMesh = this.buildBIMeshWithProperties(filteredBuilding[0], bi);
        // var buildingName = filteredBuilding[0].buildingName;
        // if(buildingName === "Tower07"){
        //     this.scene.remove(this.tower07_lMesh);
        //     this.tower07_lMesh = newMesh;
        //     this.scene.add(newMesh);
        // }
        // else if(buildingName === "Tower08"){
        //     this.scene.remove(this.tower08_lMesh);
        //     this.tower08_lMesh = newMesh;
        //     this.scene.add(newMesh);
        // }
        // else if(buildingName === "Tower09"){
        //     this.scene.remove(this.tower09_lMesh);
        //     this.tower09_lMesh = newMesh;
        //     this.scene.add(newMesh);
        // }
        // else if(buildingName === "Tower10"){
        //     this.scene.remove(this.tower10_lMesh);
        //     this.tower10_lMesh = newMesh;
        //     this.scene.add(newMesh);
        // }
        
        // var parsedCa = JSON.parse(bi[0].caJson);
        // this.buildingValues.floors = parsedCa.Floors;
        // this.buildingValues.height = parsedCa.Height;
        // this.buildingValues.apartments = parsedCa.Apartments;
        // this.buildingValues.har = Math.round(parsedCa.Affordable_Housing_Ratio * 100*100)/100 + '%';;
        // this.buildingValues.grossFloorArea = parsedCa.GFA;
        // this.buildingValues.efficiency = Math.round(parsedCa.Efficiency * 100*100)/100 + '%';

        // this.RecalculateProjectData(this.buildingwithBuildingInstances.buildings);

    }

    RecalculateProjectData(buildings: any){
        var filteredRecords= [];
        this.projectValues.projIRR = 0;//+= Number(JSON.parse(geometryData.caJson).ProjectIRR);
        this.projectValues.projhar = 0; // += Number(JSON.parse(geometryData.caJson).Affordable_Housing_Ratio);
        this.projectValues.projmoc = 0; //+= Number(JSON.parse(geometryData.caJson).ProjectMoc);

        for(let i = 0; i< buildings.length; i++){
            filteredRecords.push(buildings[i].buildingInstances.filter(f => f.isDefault === true));

            this.projectValues.projIRR += Number(JSON.parse(filteredRecords[i][0].caJson).ProjectIRR);
            this.projectValues.projhar += Number(JSON.parse(filteredRecords[i][0].caJson).Affordable_Housing_Ratio);
            this.projectValues.projmoc += Number(JSON.parse(filteredRecords[i][0].caJson).ProjectMoc);
        }

        this.projectValues.projMocValue = Math.round(this.projectValues.projmoc/buildings.length * 100) + '%';
        this.projectValues.projharValue = Math.round(this.projectValues.projhar / buildings.length * 100) + '%';
        this.projectValues.projIRRValue = Math.round(this.projectValues.projIRR / buildings.length * 100) + '%';
        

    }

    saveDetails(): void{
        this.towerDetailService.putBuildingWithBuildingInstances(this.buildingwithBuildingInstances)
        .subscribe(data => {
            console.log(data);
        });
    }

    private createScene() {
        this.scene = new THREE.Scene();
        // this.scene.add(new THREE.AxisHelper(200));
        // let loader = new THREE.ColladaLoader();
        // loader.load('assets/model/multimaterial.dae', this.onModelLoadingCompleted);
        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.001);
        this.scene.background = new THREE.Color( 'lightblue' );
  
    }

    private loadData(){
        
        //podium01_s
        //const podium01_s = require('../../data/podium01_s.json');
        
        //this.podium01_s = this.defaultBuildingInstances[0];
        this.podium01_s = this.buildingwithBuildingInstances.buildings[0];
        var podium1Default = this.buildingwithBuildingInstances.buildings[0].buildingInstances.filter(f => f.isDefault === true);
        var podium01_sMesh = this.buildBIMeshWithProperties(this.podium01_s, podium1Default[0]);
        //if (podium01_sMesh.default == "true") {
            this.scene.add(podium01_sMesh);
            //}
        //podium02_s
        this.podium02_s  = this.buildingwithBuildingInstances.buildings[1];//require('../../data/podium02_s.json');
        var podium2Default = this.buildingwithBuildingInstances.buildings[1].buildingInstances.filter(f => f.isDefault === true);
        var podium02_sMesh = this.buildBIMeshWithProperties(this.podium02_s, podium2Default[0]);
        //if (podium02_sMesh.default == "true") {
            this.scene.add(podium02_sMesh);
            //}
        //podium03_s
        this.podium03_s = this.buildingwithBuildingInstances.buildings[2];//require('../../data/podium03_s.json');
        var podium3Default = this.buildingwithBuildingInstances.buildings[2].buildingInstances.filter(f => f.isDefault === true);
        var podium03_sMesh = this.buildBIMeshWithProperties(this.podium03_s, podium3Default[0]);
        //if (podium03_sMesh.default == "true") {
            this.scene.add(podium03_sMesh);
           // }
        //podium04_s
        this.podium04_s = this.buildingwithBuildingInstances.buildings[3];//require('../../data/podium04_s.json');
        var podium4Default = this.buildingwithBuildingInstances.buildings[3].buildingInstances.filter(f => f.isDefault === true);
        var podium04_sMesh = this.buildBIMeshWithProperties(this.podium04_s, podium4Default[0]);
        //if (podium04_sMesh.default == "true") {
            this.scene.add(podium04_sMesh);
           //}
        //podium05_s
        this.podium05_s = this.buildingwithBuildingInstances.buildings[4];//require('../../data/podium05_s.json');
        var podium5Default = this.buildingwithBuildingInstances.buildings[4].buildingInstances.filter(f => f.isDefault === true);
        var podium05_sMesh = this.buildBIMeshWithProperties(this.podium05_s, podium5Default[0]);
        //if (podium05_sMesh.default == "true") {
            this.scene.add(podium05_sMesh);
           // }
        //podium06_s
        this.podium06_s = this.buildingwithBuildingInstances.buildings[5];//require('../../data/podium06_s.json');
        var podium6Default = this.buildingwithBuildingInstances.buildings[5].buildingInstances.filter(f => f.isDefault === true);
        var podium06_sMesh = this.buildBIMeshWithProperties(this.podium06_s, podium6Default[0]);
        //if (podium06_sMesh.default == "true") {
            this.scene.add(podium06_sMesh);
            //}
        //podium07_s
        this.podium07_s = this.buildingwithBuildingInstances.buildings[6];//require('../../data/podium07_s.json');
        var podium7Default = this.buildingwithBuildingInstances.buildings[6].buildingInstances.filter(f => f.isDefault === true);
        var podium07_sMesh = this.buildBIMeshWithProperties(this.podium07_s, podium7Default[0]);
        //if (podium07_sMesh.default == "true") {
            this.scene.add(podium07_sMesh);
            //}
        //podium08_s
        this.podium08_s = this.buildingwithBuildingInstances.buildings[7];//require('../../data/podium08_s.json');
        var podium08Default = this.buildingwithBuildingInstances.buildings[7].buildingInstances.filter(f => f.isDefault === true);
        var podium08_sMesh = this.buildBIMeshWithProperties(this.podium08_s, podium08Default[0]);
        //if (podium08_sMesh.default == "true") {
            this.scene.add(podium08_sMesh);
           // }
        //podium09_s
        this.podium09_s = this.buildingwithBuildingInstances.buildings[8];//require('../../data/podium09_s.json');
        var podium09Default = this.buildingwithBuildingInstances.buildings[8].buildingInstances.filter(f => f.isDefault === true);
        var podium09_sMesh = this.buildBIMeshWithProperties(this.podium09_s, podium09Default[0]);
        //if (podium09_sMesh.default == "true") {
            this.scene.add(podium09_sMesh);
            //}
        //podium10_s
        this.podium10_s = this.buildingwithBuildingInstances.buildings[9];//require('../../data/podium10_s.json');
        var podium10Default = this.buildingwithBuildingInstances.buildings[3].buildingInstances.filter(f => f.isDefault === true);
        var podium10_sMesh = this.buildBIMeshWithProperties(this.podium10_s, podium10Default[0]);
       // if (podium10_sMesh.default == "true") {
            this.scene.add(podium10_sMesh);
            //}
        //podium11_s
        this.podium11_s = this.buildingwithBuildingInstances.buildings[10];//require('../../data/podium11_s.json');
        var podium11Default = this.buildingwithBuildingInstances.buildings[10].buildingInstances.filter(f => f.isDefault === true);
        var podium11_sMesh = this.buildBIMeshWithProperties(this.podium11_s, podium11Default[0]);
        //if (podium11_sMesh.default == "true") {
            this.scene.add(podium11_sMesh);
            //}
        //podium12_s
        this.podium12_s = this.buildingwithBuildingInstances.buildings[11];//require('../../data/podium12_s.json');
        var podium12Default = this.buildingwithBuildingInstances.buildings[11].buildingInstances.filter(f => f.isDefault === true);
        var podium12_sMesh = this.buildBIMeshWithProperties(this.podium12_s, podium12Default[0]);
       // if (podium12_sMesh.default == "true") {
            this.scene.add(podium12_sMesh);
            //}
        //podium13_s
        this.podium13_s = this.buildingwithBuildingInstances.buildings[12];//require('../../data/podium13_s.json');
        var podium13Default = this.buildingwithBuildingInstances.buildings[12].buildingInstances.filter(f => f.isDefault === true);
        var podium13_sMesh = this.buildBIMeshWithProperties(this.podium13_s, podium13Default[0]);
        //if (podium13_sMesh.default == "true") {
            this.scene.add(podium13_sMesh);
            //}
        //podium14_s
        this.podium14_s = this.buildingwithBuildingInstances.buildings[13];//require('../../data/podium14_s.json');
        var podium14Default = this.buildingwithBuildingInstances.buildings[13].buildingInstances.filter(f => f.isDefault === true);
        var podium14_sMesh = this.buildBIMeshWithProperties(this.podium14_s, podium14Default[0]);
       // if (podium14_sMesh.default == "true") {
            this.scene.add(podium14_sMesh);
            //}
        //podium15_s
        this.podium15_s = this.buildingwithBuildingInstances.buildings[14];//require('../../data/podium15_s.json');
        var podium15Default = this.buildingwithBuildingInstances.buildings[14].buildingInstances.filter(f => f.isDefault === true);
        var podium15_sMesh = this.buildBIMeshWithProperties(this.podium15_s, podium15Default[0]);
       // if (podium15_sMesh.default == "true") {
            this.scene.add(podium15_sMesh);
           // }
        //podium16_s
        this.podium16_s = this.buildingwithBuildingInstances.buildings[15];//require('../../data/podium16_s.json');
        var podium16Default = this.buildingwithBuildingInstances.buildings[15].buildingInstances.filter(f => f.isDefault === true);
        var podium16_sMesh = this.buildBIMeshWithProperties(this.podium16_s, podium16Default[0]);
       // if (podium16_sMesh.default == "true") {
            this.scene.add(podium16_sMesh);
           // }
        //podium17_s
        this.podium17_s = this.buildingwithBuildingInstances.buildings[16];//require('../../data/podium17_s.json');
        var podium17Default = this.buildingwithBuildingInstances.buildings[16].buildingInstances.filter(f => f.isDefault === true);
        var podium17_sMesh = this.buildBIMeshWithProperties(this.podium17_s, podium17Default[0]);
        //if (podium17_sMesh.default == "true") {
            this.scene.add(podium17_sMesh);
            //}
        //tower01_s
        this.tower01_s = this.buildingwithBuildingInstances.buildings[17];//require('../../data/tower01_s.json');
        var tower01Default = this.buildingwithBuildingInstances.buildings[17].buildingInstances.filter(f => f.isDefault === true);
        var tower01_sMesh = this.buildBIMeshWithProperties(this.tower01_s, tower01Default[0]);
        //if (tower01_sMesh.default == "true") {
            this.scene.add(tower01_sMesh);
            //}
        //tower02_s
        this.tower02_s = this.buildingwithBuildingInstances.buildings[18];//require('../../data/tower02_s.json');
        var tower02Default = this.buildingwithBuildingInstances.buildings[18].buildingInstances.filter(f => f.isDefault === true);
        var tower02_sMesh = this.buildBIMeshWithProperties(this.tower02_s, tower02Default[0]);
       // if (tower02_sMesh.default == "true") {
            this.scene.add(tower02_sMesh);
           // }
        //tower03_s
        this.tower03_s = this.buildingwithBuildingInstances.buildings[19]//require('../../data/tower03_s.json');
        var tower03Default = this.buildingwithBuildingInstances.buildings[19].buildingInstances.filter(f => f.isDefault === true);
        var tower03_sMesh = this.buildBIMeshWithProperties(this.tower03_s, tower03Default[0]);
       // if (tower03_sMesh.default == "true") {
            this.scene.add(tower03_sMesh);
           // }
        //tower04_s
        this.tower04_s = this.buildingwithBuildingInstances.buildings[20];//require('../../data/tower04_s.json');
        var tower04Default = this.buildingwithBuildingInstances.buildings[20].buildingInstances.filter(f => f.isDefault === true);
        var tower04_sMesh = this.buildBIMeshWithProperties(this.tower04_s, tower04Default[0]);
       // if (tower04_sMesh.default == "true") {
            this.scene.add(tower04_sMesh);
            //}
        //tower05_s
        this.tower05_s = this.buildingwithBuildingInstances.buildings[21];//require('../../data/tower05_s.json');
        var tower05Default = this.buildingwithBuildingInstances.buildings[21].buildingInstances.filter(f => f.isDefault === true);
        var tower05_sMesh = this.buildBIMeshWithProperties(this.tower05_s, tower05Default[0]);
        //if (tower05_sMesh.default == "true") {
            this.scene.add(tower05_sMesh);
           // }
        //tower06_s
        this.tower06_s = this.buildingwithBuildingInstances.buildings[22];//require('../../data/tower06_s.json');
        var tower06Default = this.buildingwithBuildingInstances.buildings[22].buildingInstances.filter(f => f.isDefault === true);
        var tower06_sMesh = this.buildBIMeshWithProperties(this.tower06_s,tower06Default[0]);
       // if (tower06_sMesh.default == "true") {
            this.scene.add(tower06_sMesh);
           // }
        //tower07_m
        this.tower07_s = this.buildingwithBuildingInstances.buildings[23];//require('../../data/tower07_m.json');
        var tower07Default = this.buildingwithBuildingInstances.buildings[23].buildingInstances.filter(f => f.isDefault === true);
        this.tower07_lMesh = this.buildBIMeshWithProperties(this.tower07_s, tower07Default[0]);
       // if (tower07_mMesh.default == "true") {
            this.scene.add(this.tower07_lMesh);
            //}
        //tower07_s
        // const tower07_s = this.defaultBuildingInstances[24].buildingInstances;//require('../../data/tower07_s.json');
        // var tower07_sMesh = this.buildMeshWithProperties(tower07_s);
        // if (tower07_sMesh.default == "true") {
        //     this.scene.add(tower07_sMesh);
        //     }
        //tower08_l
        this.tower08_s = this.buildingwithBuildingInstances.buildings[24];//require('../../data/tower08_l.json');
        var tower08Default = this.buildingwithBuildingInstances.buildings[24].buildingInstances.filter(f => f.isDefault === true);
        this.tower08_lMesh = this.buildBIMeshWithProperties(this.tower08_s,tower08Default[0]);
       // if (tower08_lMesh.default == "true") {
            this.scene.add(this.tower08_lMesh);
           // }
        //tower08_m
        // const tower08_m = require('../../data/tower08_m.json');
        // var tower08_mMesh = this.buildMeshWithProperties(tower08_m);
        // if (tower08_mMesh.default == "true") {
        //     this.scene.add(tower08_mMesh);
        //     }
        //tower08_s
        // const tower08_s = require('../../data/tower08_s.json');
        // var tower08_sMesh = this.buildMeshWithProperties(tower08_s);
        // if (tower08_sMesh.default == "true") {
        //     this.scene.add(tower08_sMesh);
        //     }
        //tower09_l
        this.tower09_s = this.buildingwithBuildingInstances.buildings[25];//require('../../data/tower09_l.json');
        var tower09Default = this.buildingwithBuildingInstances.buildings[25].buildingInstances.filter(f => f.isDefault === true);
        this.tower09_lMesh = this.buildBIMeshWithProperties(this.tower09_s, tower09Default[0]);
        //if (tower09_lMesh.default == "true") {
            this.scene.add(this.tower09_lMesh);
           // }
        //tower09_m
        // const tower09_m = require('../../data/tower09_m.json');
        // var tower09_mMesh = this.buildMeshWithProperties(tower09_m);
        // if (tower09_mMesh.default == "true") {
        //     this.scene.add(tower09_mMesh);
        //     }
        // //tower09_s
        // const tower09_s = require('../../data/tower09_s.json');
        // var tower09_sMesh = this.buildMeshWithProperties(tower09_s);
        // if (tower09_sMesh.default == "true") {
        //     this.scene.add(tower09_sMesh);
        //     }
        //tower10_l
        this.tower10_s = this.buildingwithBuildingInstances.buildings[26];//require('../../data/tower10_l.json');
        var tower10Default = this.buildingwithBuildingInstances.buildings[26].buildingInstances.filter(f => f.isDefault === true);
        this.tower10_lMesh = this.buildBIMeshWithProperties(this.tower10_s, tower10Default[0]);
       // if (tower10_lMesh.default == "true") {
            this.scene.add(this.tower10_lMesh);
            //}
        //tower10_m
        // const tower10_m = require('../../data/tower10_m.json');
        // var tower10_mMesh = this.buildMeshWithProperties(tower10_m);
        // if (tower10_mMesh.default == "true") {
        //     this.scene.add(tower10_mMesh);
        //     }
        // //tower10_s
        // const tower10_s = require('../../data/tower10_s.json');
        // var tower10_sMesh = this.buildMeshWithProperties(tower10_s);
        // if (tower10_sMesh.default == "true") {
        //     this.scene.add(tower10_sMesh);
        //     }
        var defaultBuildings = this.buildingwithBuildingInstances.buildings.length;
        this.projectValues.projMocValue = Math.round(this.projectValues.projmoc/defaultBuildings * 100) + '%';
        this.projectValues.projharValue = Math.round(this.projectValues.projhar / defaultBuildings * 100) + '%';
        this.projectValues.projIRRValue = Math.round(this.projectValues.projIRR / defaultBuildings * 100) + '%';

        //Math.round(parsedCa.ProjectMoc * 100*100)/100
            
    }
    private loadContext(){
        //context
        const context = require('../../data/context.json');
        let contextMat = new THREE.MeshLambertMaterial({
            color: 0x555555,
            dithering: true
        });
        
        let contextMesh = this.buildMeshWithMat(context, contextMat);
        this.scene.add(contextMesh);
        
    }

    
    private buildGeometry(geometryData) {
        // //let geomData = geometryData.geom;
        // let geomData = geometryData.geoJson;
        // let vertices = JSON.parse(geometryData.geoJson).Vertices;//geomData.vertices;
        // let faces = JSON.parse(geometryData.geoJson).faces;//geomData.faces;

        var geomData;
        var vertices;
        var faces;

        if(geometryData.geoJson !== undefined){
            geomData = geometryData.geoJson;
            vertices = JSON.parse(geometryData.geoJson).Vertices;
            faces = JSON.parse(geometryData.geoJson).faces;

            this.projectValues.projIRR += Number(JSON.parse(geometryData.caJson).ProjectIRR);
            this.projectValues.projhar += Number(JSON.parse(geometryData.caJson).Affordable_Housing_Ratio);
            this.projectValues.projmoc += Number(JSON.parse(geometryData.caJson).ProjectMoc);
        }
        else{
            geomData = geometryData.geom;
            vertices = geomData.vertices;
            faces = geomData.faces;
        }
  
        let geom = new THREE.Geometry();
  
        for (let i = 2; i < vertices.length; i += 3) {
            geom.vertices.push(new THREE.Vector3(vertices[i - 2], vertices[i - 1], vertices[i]));
        }
  
        if (faces) {
            let k = 0;
            while (k < faces.length) {
                // QUAD FACE
                if (faces[k] == 1) {
                    geom.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]));
                    geom.faces.push(new THREE.Face3(faces[k + 1], faces[k + 3], faces[k + 4]));
                    k += 5;
                } else if (faces[k] == 0) {
                    geom.faces.push(new THREE.Face3(faces[k + 1], faces[k + 2], faces[k + 3]));
                    k += 4;
                } else {
                    break;
                }
            }
        }
  
        geom.computeFaceNormals();
        geom.computeVertexNormals();
        return geom;
    }
  
    private buildMesh(geom) {
        let g = this.buildGeometry(geom);
        let mat = new THREE.MeshStandardMaterial();
        mat.metalness = 0;
        let mesh = new THREE.Mesh(g, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        return mesh;
    }

    private buildBIMeshWithProperties(building, buildingInstance) {
        //var buildingInstance = building.buildingInstances[0];
        //var buildingInstance = building.buildingInstances.filter(f => f.isDefault === true);
       // var buildingInstance = buildingInstance[0];
        let g = this.buildGeometry(buildingInstance);
        let mat = new THREE.MeshStandardMaterial();
        mat.metalness = 0;
        //let mesh = new THREE.Mesh(g, mat);
        let mesh = new towermesh(g, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        
        //Properties from record
        mesh.default = buildingInstance.isDefault;
        mesh.name = building.buildingName;
        mesh.ca = buildingInstance.caJson;
        
        return mesh;
    }
        
    private buildMeshWithProperties(geom) {
        let g = this.buildGeometry(geom);
        let mat = new THREE.MeshStandardMaterial();
        mat.metalness = 0;
        //let mesh = new THREE.Mesh(g, mat);
        let mesh = new towermesh(g, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        
        //Properties from record
        mesh.default = geom.isDefault;
        mesh.name = geom.name;
        mesh.use = geom.use;
        mesh.grossFloorArea = geom.grossFloorArea;
        mesh.efficiency = geom.efficiency;
        mesh.height = geom.height;
        mesh.numFloors = geom.numFloors;
        mesh.numApartments = geom.numApartments;
        mesh.har = geom.har;
        mesh.irr = geom.irr;
        mesh.rolirr = geom.rolirr;
        mesh.moc = geom.moc;
        mesh.ca = geom.caJson;
        
        return mesh;
    }
  
  
    private buildMeshWithMat(geom, mat) {
        let g = this.buildGeometry(geom);
        let mesh = new THREE.Mesh(g, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
  

    private onModelLoadingCompleted(collada) {
        let modelScene = collada.scene;
        this.scene.add(modelScene);
        this.render();
    }

    private addGroundPlane() {
        const mat = new THREE.MeshStandardMaterial({
            color: 'steelblue',
            dithering: true
        });
        mat.metalness = 0;
        const geo = new THREE.PlaneBufferGeometry(20000, 20000);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0, 0);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }
  
    private createLight() {

        // lights
        let dlight = new THREE.DirectionalLight(0xffffff);
        dlight.position.set(-1, -1, 0);
        this.scene.add(dlight);

        // let dirlight = new THREE.DirectionalLight(0x002288);
        // dirlight.position.set(-1, -1, 0);
        // this.scene.add(dirlight);

        let amblight = new THREE.AmbientLight(0x222222);
        this.scene.add(amblight);

        let light = new THREE.PointLight(0xffffff, 1, 500);
        light.position.set(0, 0, 200);
        this.scene.add(light);

        // let light = new THREE.PointLight(0xffffff, 1, 1000);
        // light.position.set(0, 0, -100);
        // this.scene.add(light);
    }

    private createCamera() {
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        // Set position and look at
        this.camera.position.x = -100;
        this.camera.position.y = -500;
        this.camera.position.z = 50;
        this.camera.up = new THREE.Vector3(0,0,1);
        this.camera.lookAt(new THREE.Vector3(200,200,50));
    }

    private getAspectRatio(): number {
        let height = this.canvas.clientHeight;
        if (height === 0) {
            return 0;
        }
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private startRendering() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        // this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.renderer.autoClear = true;

        let component: TowerDetailComponent = this;

        (function render() {
            requestAnimationFrame(render);
            component.render();
        }());
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }
    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    public addControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;
        this.controls.userPanSpeed = 2.0;
        this.controls.zoomSpeed = 0.5;
        this.controls.rotateSpeed = 0.25;
        this.controls.panSpeed = 0.25;
        this.controls.screenSpacePanning = false; // if true, pan in screen-space
        this.controls.keyPanSpeed = 1.0; // pixels moved per arrow key push
        this.controls.minDistance = 1;
        this.controls.maxDistance = 1000;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.update();    
        this.controls.addEventListener('change', this.render);

    }

    /* EVENTS */
    
    public onTouch(event: TouchEvent) {
        // Simulate mouse click when a touch event starts
        console.log("touchStart");
        var mouseEvent = new MouseEvent("mouseDown", {"clientX": event.touches[0].clientX, "clientY":event.touches[0].clientY});
        this.onClick(mouseEvent);
      }

    public onClick(event: MouseEvent) {
        console.log("onClick");
        
        event.preventDefault();

        // Example of mesh selection/pick:
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        let obj: THREE.Object3D[] = [];
        this.findAllObjects(obj, this.scene);
        let intersects = raycaster.intersectObjects(obj);
        console.log("Scene has " + obj.length + " objects");
        console.log(intersects.length + " intersected objects found")
        
        intersects.forEach((i) => {
            console.log(i.object); // do what you want to do with object
        });
        
        // INTERSECTED = the object in the scene currently closest to the camera 
        //      and intersected by the Ray projected from the mouse position    
  
        // if there is one (or more) intersections
        if (intersects.length > 0) {
            // if the closest object intersected is not the currently stored intersection object
            if (intersects[0].object != this.INTERSECTED) {
  
                // only if it has a "name" field.
                if (intersects[0].object.name) {
                    // restore previous intersection object (if it exists) to its original color
                    if (this.INTERSECTED)
                        this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
                    // store reference to closest object as current intersection object
                    this.INTERSECTED = intersects[0].object;
                    // store color of closest object (for later restoration)
                    this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
                    // set a new color for closest object
                    this.INTERSECTED.material.color.setHex(0x28c0de);

                    this.buildingValues.towerName = this.INTERSECTED.name;
                    this.buildingValues.type = this.INTERSECTED.use;
                    var parsedCa = JSON.parse(this.INTERSECTED.ca);
                    if(parsedCa !== undefined){
                        this.buildingValues.floors = parsedCa.Floors;
                        this.buildingValues.height = parsedCa.Height;
                        this.buildingValues.apartments = parsedCa.Apartments;
                        // this.moc = Math.round(parsedCa.ProjectMoc * 100*100)/100 + '%';
                        // this.IRR = Math.round(parsedCa.ProjectIRR * 100*100)/100 + '%';
                        // this.rolIRR = '-';
                        this.buildingValues.har = Math.round(parsedCa.Affordable_Housing_Ratio * 100*100)/100 + '%';
                        this.buildingValues.grossFloorArea = parsedCa.GFA;
                        this.buildingValues.efficiency = Math.round(parsedCa.Efficiency * 100*100)/100 + '%';

                        
                    }
                    else{
                        this.buildingValues.floors = this.INTERSECTED.ca.floors;
                        this.buildingValues.height = this.INTERSECTED.ca.height;
                        this.buildingValues.apartments = this.INTERSECTED.ca.apartments;
                        // this.moc = Math.round(this.INTERSECTED.ca.projectmoc * 100*100)/100 + '%';
                        // this.IRR = Math.round(this.INTERSECTED.ca.projectirr * 100*100)/100 + '%';
                        // this.rolIRR = '-';
                        this.buildingValues.har = Math.round(this.INTERSECTED.ca.har * 100*100)/100 + '%';
                        this.buildingValues.grossFloorArea = this.INTERSECTED.grossFloorArea;
                        this.buildingValues.efficiency = Math.round(this.INTERSECTED.ca.efficiency * 100*100)/100 + '%';
                    } 
  
                    //update text via Texture
                    // context1.clearRect(0, 0, 640, 480);
                    // var message = intersects[0].object.name;
                    // var metrics = context1.measureText(message);
                    // var width = metrics.width;
                    // context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
                    // context1.fillRect(0, 0, width + 8, 20 + 8);
                    // context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                    // context1.fillRect(2, 2, width + 4, 20 + 4);
                    // context1.fillStyle = "rgba(0,0,0,1)"; // text color
                    // context1.fillText(message, 4, 20);
                    // texture1.needsUpdate = true;
                } else {
                }
            }
        } else // there are no intersections
        {
            // restore previous intersection object (if it exists) to its original color
            if (this.INTERSECTED)
                this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
            // remove previous intersection object reference
            //     by setting current intersection object to "nothing"
            this.INTERSECTED = null;
            

            
            this.buildingValues.towerName = "-";
            this.buildingValues.type = "-";
            this.buildingValues.floors = 0;
            this.buildingValues.height = 0;
            this.buildingValues.apartments = 0;
            // this.moc = "-";
            // this.IRR = "-";
            // this.rolIRR = "-";
            this.buildingValues.har = "-";
            this.buildingValues.grossFloorArea = 0;
            this.buildingValues.efficiency = "-";

        }
  
  
        this.controls.update();

    }

    private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
        // NOTE: Better to keep separate array of selected objects
        if (parent.children.length > 0) {
            parent.children.forEach((i) => {
                pred.push(i);
                this.findAllObjects(pred, i);                
            });
        }
    }

    public onMouseUp(event: MouseEvent) {
        console.log("onMouseUp");
    }


    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.render();
    }

    @HostListener('document:keypress', ['$event'])
    public onKeyPress(event: KeyboardEvent) {
        console.log("onKeyPress: " + event.key);
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
      
        this.towerDetailService.GetBuildingWithBuildingInstances()
            .subscribe(data => {
                this.buildingwithBuildingInstances = data;
                this.defaultBuildingInstances = data.buildings;
                //let defaultBI = this.buildingwithBuildingInstances;
                //console.log(data);
                // for(let i = 0; i< data.buildings.length; i++){
                //    // this.defaultBuildingInstances.push(data.buildings[i]);
                //    this.defaultBuildingInstances.push(this.buildingwithBuildingInstances.buildings[i]);
                //     this.defaultBuildingInstances[i].buildingInstances = this.defaultBuildingInstances[i].buildingInstances.filter(f => f.isDefault === true);
                  
                //     //TODO: calcuate IRR, MOC etc values.
                   
                // }

                // for(let i = 0; i< defaultBI.buildings.length; i++){
                //     defaultBI.buildings[i].buildingInstances = defaultBI.buildings[i].buildingInstances.filter(f => f.isDefault === true);
                // }

                this.loadData();

            });

            this.createScene();
            this.addGroundPlane();
            this.loadContext();
            this.createLight();
            this.createCamera();
            // this.startRendering();
            this.addControls();
            // this.animate();

    }

    aptLabelClicked(): void{
        this.showApartmentLabel = true;
    }

    aptChanged(): void{
        this.showApartmentLabel = false;
    }

}