# Hansprint OS voor WordPress — eerste versie

Een zelfstandige plugin voor WordPress 6.6+ en PHP 8.0+. Geen Node.js nodig op je hosting. Gebruik de blokeditor (niet de Classic Editor).

## Installeren

1. Test eerst op een kopie/testomgeving van je WordPress-site.
2. Upload `hansprint-os.zip` bij **Plugins → Nieuwe plugin → Plugin uploaden** en activeer.
3. Open **Hansprint OS** in het beheermenu.
4. Kies een startpatroon en maak een conceptpagina.
5. Bewerk de pagina. Selecteer een Hansprint-blok en pas titel, beschrijving, knoptekst en link aan in de blokzijbalk. Gebruik daarnaast normale WordPress-blokken voor afbeeldingen, kolommen en andere inhoud.
6. Bekijk het voorbeeld, vervang voorbeeldteksten en vul contactlinks in voordat je publiceert.
7. Stel de pagina desgewenst in als homepage via **Instellingen → Lezen**.

## Huisstijl en inlogpagina

In **Hansprint OS** stel je merknaam, merkkleur, logo, achtergrondkleur en welkomsttekst in. Het voorbeeld verandert direct; klik **Huisstijl opslaan** om wijzigingen toe te passen. Vink **Eigen inlogstijl inschakelen** aan om de daadwerkelijke WordPress-inlogpagina aan te passen. Bij uitschakelen gebruikt WordPress weer de oorspronkelijke styling. Je inlogadres, accounts, wachtwoordherstel en beveiliging veranderen niet.

Instellingen worden per website bewaard. Installeer de plugin dus op elke klantwebsite. Dit is nog geen centraal multisite-/hostingdashboard. Het thema blijft verantwoordelijk voor header, footer, menu’s en algemene layout. Merk-kleuren gelden voor Hansprint-blokken, niet automatisch voor alle themablokken. De ingebouwde startpatronen bevatten voorbeeldteksten voor Hansprint, Taalcentrum Duits, Bijkerk Exclusive Cars en een nieuwe klant; ze importeren geen bestaande websites, cursusdata of voertuigen.

Alleen beheerders kunnen huisstijl-instellingen wijzigen en vanuit het dashboard een startpagina maken. Gebruikers met paginarechten kunnen de blokken gebruiken. Elke startactie maakt een nieuw concept. Er wordt niets automatisch gepubliceerd en de huidige homepage wordt niet vervangen. Bij deactiveren blijven de instellingen bewaard en blijft opgeslagen bloktekst als fallback bestaan. Reactiveren herstelt de opmaak.

## Ontwikkeling en verificatie

- `node --test wordpress/tests/editor.test.mjs` — editorregistratie, opgeslagen fallback en veilige links.
- Test echte WordPress/PHP via de Playground-blueprint in `wordpress/tests/blueprint.json`. Mount de plugin op `/wordpress/wp-content/plugins/hansprint-os` en tests op `/hansprint-tests`.
- `pnpm verify` — bestaande repositorychecks.
- Zip alleen de map `wordpress/hansprint-os`; de zip moet `hansprint-os/hansprint-os.php` bevatten. Geen dependencies of testbestanden opnemen.

Gebruikte WordPress-API’s: [block.json](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/), [Settings API](https://developer.wordpress.org/reference/functions/register_setting/), [login_enqueue_scripts](https://developer.wordpress.org/reference/hooks/login_enqueue_scripts/).
