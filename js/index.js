import 'three/build/three';
import 'three/examples/js/controls/DragControls';
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/controls/TransformControls';
import 'three/examples/js/exporters/STLExporter';
import 'three/examples/js/exporters/OBJExporter';
import 'controlkit/lib/ControlKit';
import 'jquery/dist/jquery';
import 'golden-layout/dist/goldenlayout';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-dark-theme.css';
import './util/rawflate/rawdeflate';
import './util/rawflate/rawinflate';
import './MainPage/CascadeViewHandles';
import './MainPage/CascadeView';
import 'monaco-editor/dev/vs/editor/editor.main';
import 'monaco-editor/min/vs/loader';
import 'monaco-editor/min/vs/editor/editor.main.nls';
import 'monaco-editor/min/vs/editor/editor.main';
import './MainPage/CascadeMain'

var appbody = document.querySelector('#appbody');
document.querySelector('body').addEventListener('load', initialize())