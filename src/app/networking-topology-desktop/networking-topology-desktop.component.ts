import { AfterViewInit, Component, HostListener} from '@angular/core';
import * as jsplumb from 'jsplumb';

@Component({
    selector: 'networking-topology-desktop',
    templateUrl: './networking-topology-desktop.component.html',
    styleUrls: ['./networking-topology-desktop.component.scss']
})
export class NetworkingTopologyDesktopComponent implements AfterViewInit {


  private upArrow = `<div>
                        <svg width="10px" height="10px">
                            <g>
                                <path d="M0,10 L5,0 L10,10 L5,7 Z" fill="rgb(0,125,182)" />
                            </g>
                        </svg>
                      </div>`;

  private downArrow = `<div>
                          <svg width="10px" height="10px">
                             <g transform="rotate(180,5,5)">
                                  <path d="M0,10 L5,0 L10,10 L5,7 Z" fill="rgb(0,125,182)" />
                             </g>
                          </svg>
                      </div>`;

  private rightArrow = `<div>
                          <svg width="10px" height="10px">
                             <g transform="rotate(90,5,5)">
                                <path d="M0,10 L5,0 L10,10 L5,7 Z" fill="rgb(0,125,182)" />
                             </g>
                          </svg>
                        </div>`;


  private vpnOverInternet = `<div style="margin-top: -10px; margin-left: -15px;">
                                <svg width="10" height="10">
                                  <circle cx=5 cy=5 r="5" fill="rgb(142,205,106)"/>
                                </svg>
                                <span>Net5000</span>
                              </div>`;

  private vpcId = `<div style="margin-top: -10px;margin-left: -10px">
                    <span>Net5000</span>
                  </div>`;

  private container = 'topology-container';

  /*
  Connectors
   */
  internetToManagementGatewayConnection: any;
  internetToComputeGatewayConnection: any;
  onPremToManagementGatewayConnection: any;
  onPremToComputeGatewayConnection: any;
  vpcToComputeGatewayConnection: any;

  /*
  State that manages whether the SDDC is bootstrapped or not
   */
  bootstrapped = true;



  ngAfterViewInit() {
    this.onResize(null);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateView();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.updateView(true);
  }


  private updateView(recreate= false) {
    const jsPlumb = jsplumb.getInstance();
    if (recreate) {
      const jtk = document.getElementsByClassName('jtk-connector');
      if (jtk) {
        [].forEach.call(jtk, (each) => each.remove());
      }
      jsPlumb.repaintEverything();
    }
    this.connectInternetToManagementGateway();
    this.connectInternetToComputeGateway();
    if (this.bootstrapped) {
      this.connectOnPremToManagementGateway();
      this.connectOnPremToComputeGateway();
      this.connectVpcToComputeGateway();
    }
  }

  private createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
  }

  /**
   * Connect Internet to management gateway
   */
  private connectInternetToManagementGateway() {
    const jsPlumb = jsplumb.getInstance();
    if (this.internetToManagementGatewayConnection) {
      jsPlumb.detach(this.internetToManagementGatewayConnection);
    }
    jsPlumb.ready( () => {
      jsPlumb.Defaults.Endpoint = 'Blank';
      const container = document.getElementById(this.container);
      jsPlumb.setContainer(container);

      const endpointOptions = {isSource: true, isTarget: true};
      const d1 = jsPlumb.addEndpoint(document.getElementById('network-icon-card'), {anchor: 'TopCenter'}, endpointOptions);
      const d2 = jsPlumb.addEndpoint(document.getElementById('management-gateway'), {anchor: 'LeftMiddle'}, endpointOptions);

      this.internetToManagementGatewayConnection = jsPlumb.connect({
        source: d1,
        target: d2,
        connector: ['Flowchart', {curviness: 1, stub: 10}, {cssClass: 'connectorClass'}],
        endpointStyle: {fill: 'rgb(19,125,185)', outlineStroke: 'black', outlineWidth: 1},
        paintStyle: {stroke: 'rgb(19,125,185)', strokeWidth: 1}, /* dashstyle: '1' */
        overlays: [
          [ 'Arrow', { location: 1, width: 10, length: 10 }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.downArrow);
            },
            location: 0.01,
            id: 'endarrow'
          }]
        ]
      });

    });
  }

  /**
   * Connect Internet to compute gateway
   */
  private connectInternetToComputeGateway() {
    const jsPlumb = jsplumb.getInstance();
    if (this.internetToComputeGatewayConnection) {
      jsPlumb.detach(this.internetToComputeGatewayConnection);
    }
    jsPlumb.ready( () => {
      jsPlumb.Defaults.Endpoint = 'Blank';
      const container = document.getElementById(this.container);
      jsPlumb.setContainer(container);

      const endpointOptions = {isSource: true, isTarget: true};
      const d1 = jsPlumb.addEndpoint(document.getElementById('network-icon-card'), {anchor: 'Bottom'}, endpointOptions);
      const d2 = jsPlumb.addEndpoint(document.getElementById('compute-gateway'), {anchor: 'Left'}, endpointOptions);

      this.internetToComputeGatewayConnection = jsPlumb.connect({
        source: d1,
        target: d2,
        connector: ['Flowchart', {curviness: 1, stub: 10}, {cssClass: 'connectorClass'}],
        endpointStyle: {fill: 'rgb(19,125,185)', outlineStroke: 'black', outlineWidth: 1},
        paintStyle: {stroke: 'rgb(19,125,185)', strokeWidth: 1, dashstyle: '1'}, /* dashstyle: '1' */
        overlays: []
      });

    });
  }

  /**
   * Connect Internet to compute gateway
   */
  private connectOnPremToManagementGateway() {
    const jsPlumb = jsplumb.getInstance();
    if (this.onPremToManagementGatewayConnection) {
      jsPlumb.detach(this.onPremToManagementGatewayConnection);
    }
    jsPlumb.ready( () => {
      jsPlumb.Defaults.Endpoint = 'Blank';
      const container = document.getElementById(this.container);
      jsPlumb.setContainer(container);

      const endpointOptions = {isSource: true, isTarget: true};
      const d1 = jsPlumb.addEndpoint(document.getElementById('onprem-icon-card'), {anchor: 'TopCenter'}, endpointOptions);
      const d2 = jsPlumb.addEndpoint(document.getElementById('management-gateway'), {anchor: 'RightMiddle'}, endpointOptions);

      this.onPremToManagementGatewayConnection = jsPlumb.connect({
        source: d1,
        target: d2,
        connector: ['Flowchart', {curviness: 1, stub: 10}, {cssClass: 'connectorClass'}],
        endpointStyle: {fill: 'rgb(19,125,185)', outlineStroke: 'black', outlineWidth: 1},
        paintStyle: {stroke: 'rgb(19,125,185)', strokeWidth: 1}, /* dashstyle: '1' */
        overlays: [
          [ 'Arrow', { location: 1, width: 10, length: 10 }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.downArrow);
            },
            location: 0.01,
            id: 'endarrow'
          }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.vpnOverInternet);
            },
            location: 0.5,
            id: 'custom-label'
          }]
        ]
      });
    });
  }

  /**
   * Connect Internet to compute gateway
   */
  private connectOnPremToComputeGateway() {
    const jsPlumb = jsplumb.getInstance();
    if (this.onPremToComputeGatewayConnection) {
      jsPlumb.detach(this.onPremToComputeGatewayConnection);
    }
    jsPlumb.ready( () => {
      jsPlumb.Defaults.Endpoint = 'Blank';
      const container = document.getElementById(this.container);
      jsPlumb.setContainer(container);

      const endpointOptions = {isSource: true, isTarget: true};
      const d1 = jsPlumb.addEndpoint(document.getElementById('onprem-icon-card'), {anchor: 'Bottom'}, endpointOptions);
      const d2 = jsPlumb.addEndpoint(document.getElementById('compute-gateway-right'), {anchor: 'Right'}, endpointOptions);

      this.onPremToComputeGatewayConnection = jsPlumb.connect({
        source: d1,
        target: d2,
        connector: ['Flowchart', {curviness: 1, stub: 10}, {cssClass: 'connectorClass'}],
        endpointStyle: {fill: 'rgb(19,125,185)', outlineStroke: 'black', outlineWidth: 1},
        paintStyle: {stroke: 'rgb(19,125,185)', strokeWidth: 1}, /* dashstyle: '1' */
        overlays: [
          [ 'Arrow', { location: 1, width: 10, length: 10 }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.upArrow);
            },
            location: 0.01,
            id: 'endarrow'
          }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.vpnOverInternet);
            },
            location: 0.5,
            id: 'custom-label'
          }]
        ]
      });
    });
  }

  /**
   * Connect compute gateway to the amazon vpc
   */
  private connectVpcToComputeGateway() {
    const jsPlumb = jsplumb.getInstance();
    if (this.vpcToComputeGatewayConnection) {
      jsPlumb.detach(this.vpcToComputeGatewayConnection);
    }
    jsPlumb.ready( () => {
      jsPlumb.Defaults.Endpoint = 'Blank';
      const container = document.getElementById(this.container);
      jsPlumb.setContainer(container);

      const endpointOptions = {isSource: true, isTarget: true};
      const d1 = jsPlumb.addEndpoint(document.getElementById('vpc-icon-card'), {anchor: 'Left'}, endpointOptions);
      const d2 = jsPlumb.addEndpoint(document.getElementById('vpc-anchor'), {anchor: 'Right'}, endpointOptions);

      this.vpcToComputeGatewayConnection = jsPlumb.connect({
        source: d1,
        target: d2,
        connector: ['Flowchart', {curviness: 1, stub: 10}, {cssClass: 'connectorClass'}],
        endpointStyle: {fill: 'rgb(19,125,185)', outlineStroke: 'black', outlineWidth: 1},
        paintStyle: {stroke: 'rgb(19,125,185)', strokeWidth: 1}, /* dashstyle: '1' */
        overlays: [
          [ 'Arrow', { location: 1, width: 10, length: 10 }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.rightArrow);
            },
            location: 0.01,
            id: 'endarrow'
          }],
          [ 'Custom', {
            create: (component) => {
              return this.createElementFromHTML(this.vpcId);
            },
            location: 0.3,
            id: 'vpc-label'
          }]
        ]
      });
    });
  }


}
