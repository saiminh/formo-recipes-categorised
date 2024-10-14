import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
import previewImage from './assets/formo-recipes-categorised-mockup.jpg';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<p className="explainer">
        Recipes categorised block: Below is a preview image, the block is dynamically generated to list all recipes that are published.
      </p>
      <img src={ previewImage } alt="" className="formo-recipes-categorised__preview" />
		</div>
	);
}
