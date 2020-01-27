/**
 * @author Takahiro / https://github.com/takahirox
 */

import * as THREE from 'three'
import ZipLoader from './ZipLoader.js';

function ZipLoadingManager( onLoad, onProgress, onError ) {

	THREE.LoadingManager.call( this, onLoad, onProgress, onError );

}

ZipLoadingManager.prototype = Object.assign( Object.create( THREE.LoadingManager.prototype ), {

	constructor: ZipLoadingManager

} );

ZipLoadingManager.uncompress = function ( url, exts, onLoad, onProgress, onError ) {

	var manager = new ZipLoadingManager( onLoad, onProgress, onError );

	if ( url.match( /\.zip$/ ) === null ) return Promise.resolve( { urls: [ url ], manager: manager } );

	if ( ! Array.isArray( exts ) ) exts = [ exts ];

	var str = '(';

	for ( var i = 0, il = exts.length; i < il; i ++ ) {

		if ( i > 0 ) str += '|';

		str += exts[ i ].replace( '.', '\\.' );

	}

	str += ')$';

	return new ZipLoader( manager ).load( url ).then( function ( zip ) {

		var files = zip.find( new RegExp( str, 'i' ) );

		if ( files.length === 0 ) {

			return Promise.reject( new Error( 'ZipLoadingManager: No ' + exts.join( ', ' ) + ' file in ' + url ) );

		}

		manager.setURLModifier( zip.urlResolver );

		return {

			urls: files,
			manager: manager

		};

	} ).catch( onError );

};


export { ZipLoadingManager };
