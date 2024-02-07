'use client';

import ThemeModeToggler from '@/app/components/reusables/theme-toggler';
import CopyRight from '@/app/components/footer/copyright';
import { Button } from '@/app/components/ui/button';
import Nav from '@/app/components/nav/nav';
import { Badge } from '@/app/components/ui/badge';
import { TextContent } from './components/reusables/content';
import { MediumSection } from './components/reusables/sections';

export default function Home() {
  return (
    <>
      <Nav></Nav>
      <MediumSection>
        <TextContent>
          If youd like to preserve the default values for a theme option but
          also add new values, add your extensions under the theme.extend key in
          your configuration file. Values under this key are merged with
          existing theme values and automatically become available as new
          classes that you can use. As an example, here we extend the fontFamily
          property to add the font-display class that can change the font used
          on an element: If youd like to preserve the default values for a theme
          option but also add new values, add your extensions under the
          theme.extend key in your configuration file. Values under this key are
          merged with existing theme values and automatically become available
          as new classes that you can use. As an example, here we extend the
          fontFamily property to add the font-display class that can change the
          font used on an element: If youd like to preserve the default values
          for a theme option but also add new values, add your extensions under
          the theme.extend key in your configuration file. Values under this key
          are merged with existing theme values and automatically become
          available as new classes that you can use. As an example, here we
          extend the fontFamily property to add the font-display class that can
          change the font used on an element: If youd like to preserve the
          default values for a theme option but also add new values, add your
          extensions under the theme.extend key in your configuration file.
          Values under this key are merged with existing theme values and
          automatically become available as new classes that you can use. As an
          example, here we extend the fontFamily property to add the
          font-display class that can change the font used on an element: If
          youd like to preserve the default values for a theme option but also
          add new values, add your extensions under the theme.extend key in your
          configuration file. Values under this key are merged with existing
          theme values and automatically become available as new classes that
          you can use. As an example, here we extend the fontFamily property to
          add the font-display class that can change the font used on an
          element: If youd like to preserve the default values for a theme
          option but also add new values, add your extensions under the
          theme.extend key in your configuration file. Values under this key are
          merged with existing theme values and automatically become available
          as new classes that you can use. As an example, here we extend the
          fontFamily property to add the font-display class that can change the
          font used on an element: If youd like to preserve the default values
          for a theme option but also add new values, add your extensions under
          the theme.extend key in your configuration file. Values under this key
          are merged with existing theme values and automatically become
          available as new classes that you can use. As an example, here we
          extend the fontFamily property to add the font-display class that can
          change the font used on an element: If youd like to preserve the
          default values for a theme option but also add new values, add your
          extensions under the theme.extend key in your configuration file.
          Values under this key are merged with existing theme values and
          automatically become available as new classes that you can use. As an
          example, here we extend the fontFamily property to add the
          font-display class that can change the font used on an element: If
          youd like to preserve the default values for a theme option but also
          add new values, add your extensions under the theme.extend key in your
          configuration file. Values under this key are merged with existing
          theme values and automatically become available as new classes that
          you can use. As an example, here we extend the fontFamily property to
          add the font-display class that can change the font used on an
          element:
        </TextContent>

        <CopyRight></CopyRight>
      </MediumSection>
    </>
  );
}
