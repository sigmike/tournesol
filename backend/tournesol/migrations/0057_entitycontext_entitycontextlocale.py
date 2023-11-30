# Generated by Django 4.2.7 on 2023-11-23 14:35

import core.models.mixin
from django.db import migrations, models
import django.db.models.deletion
import tournesol.models.poll


class Migration(migrations.Migration):

    dependencies = [
        ("tournesol", "0056_poll_moderation"),
    ]

    operations = [
        migrations.CreateModel(
            name="EntityContext",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        help_text="Human readable name, used to identify the context in the admin interface.",
                        max_length=64,
                        unique=True,
                    ),
                ),
                (
                    "origin",
                    models.CharField(
                        choices=[("ASSOCIATION", "Association"), ("CONTRIBUTORS", "Contributors")],
                        default="ASSOCIATION",
                        help_text="The persons who want to share this context with the rest of the community.",
                        max_length=16,
                    ),
                ),
                (
                    "predicate",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        help_text="A JSON object. The keys/values should match the metadata keys/values of the targeted entities.",
                    ),
                ),
                (
                    "unsafe",
                    models.BooleanField(
                        default=False,
                        help_text="If True, this context will make the targeted entities unsafe.",
                    ),
                ),
                (
                    "enabled",
                    models.BooleanField(
                        default=False,
                        help_text="If False, this context will have no effect, and won't be returned by the API.",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "poll",
                    models.ForeignKey(
                        default=tournesol.models.poll.Poll.default_poll_pk,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="all_entity_contexts",
                        to="tournesol.poll",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
            bases=(core.models.mixin.LocalizedFieldsMixin, models.Model),
        ),
        migrations.CreateModel(
            name="EntityContextLocale",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "language",
                    models.CharField(
                        choices=[
                            ("af", "Afrikaans"),
                            ("ar", "Arabic"),
                            ("ar-dz", "Algerian Arabic"),
                            ("ast", "Asturian"),
                            ("az", "Azerbaijani"),
                            ("bg", "Bulgarian"),
                            ("be", "Belarusian"),
                            ("bn", "Bengali"),
                            ("br", "Breton"),
                            ("bs", "Bosnian"),
                            ("ca", "Catalan"),
                            ("ckb", "Central Kurdish (Sorani)"),
                            ("cs", "Czech"),
                            ("cy", "Welsh"),
                            ("da", "Danish"),
                            ("de", "German"),
                            ("dsb", "Lower Sorbian"),
                            ("el", "Greek"),
                            ("en", "English"),
                            ("en-au", "Australian English"),
                            ("en-gb", "British English"),
                            ("eo", "Esperanto"),
                            ("es", "Spanish"),
                            ("es-ar", "Argentinian Spanish"),
                            ("es-co", "Colombian Spanish"),
                            ("es-mx", "Mexican Spanish"),
                            ("es-ni", "Nicaraguan Spanish"),
                            ("es-ve", "Venezuelan Spanish"),
                            ("et", "Estonian"),
                            ("eu", "Basque"),
                            ("fa", "Persian"),
                            ("fi", "Finnish"),
                            ("fr", "French"),
                            ("fy", "Frisian"),
                            ("ga", "Irish"),
                            ("gd", "Scottish Gaelic"),
                            ("gl", "Galician"),
                            ("he", "Hebrew"),
                            ("hi", "Hindi"),
                            ("hr", "Croatian"),
                            ("hsb", "Upper Sorbian"),
                            ("hu", "Hungarian"),
                            ("hy", "Armenian"),
                            ("ia", "Interlingua"),
                            ("id", "Indonesian"),
                            ("ig", "Igbo"),
                            ("io", "Ido"),
                            ("is", "Icelandic"),
                            ("it", "Italian"),
                            ("ja", "Japanese"),
                            ("ka", "Georgian"),
                            ("kab", "Kabyle"),
                            ("kk", "Kazakh"),
                            ("km", "Khmer"),
                            ("kn", "Kannada"),
                            ("ko", "Korean"),
                            ("ky", "Kyrgyz"),
                            ("lb", "Luxembourgish"),
                            ("lt", "Lithuanian"),
                            ("lv", "Latvian"),
                            ("mk", "Macedonian"),
                            ("ml", "Malayalam"),
                            ("mn", "Mongolian"),
                            ("mr", "Marathi"),
                            ("ms", "Malay"),
                            ("my", "Burmese"),
                            ("nb", "Norwegian Bokmål"),
                            ("ne", "Nepali"),
                            ("nl", "Dutch"),
                            ("nn", "Norwegian Nynorsk"),
                            ("os", "Ossetic"),
                            ("pa", "Punjabi"),
                            ("pl", "Polish"),
                            ("pt", "Portuguese"),
                            ("pt-br", "Brazilian Portuguese"),
                            ("ro", "Romanian"),
                            ("ru", "Russian"),
                            ("sk", "Slovak"),
                            ("sl", "Slovenian"),
                            ("sq", "Albanian"),
                            ("sr", "Serbian"),
                            ("sr-latn", "Serbian Latin"),
                            ("sv", "Swedish"),
                            ("sw", "Swahili"),
                            ("ta", "Tamil"),
                            ("te", "Telugu"),
                            ("tg", "Tajik"),
                            ("th", "Thai"),
                            ("tk", "Turkmen"),
                            ("tr", "Turkish"),
                            ("tt", "Tatar"),
                            ("udm", "Udmurt"),
                            ("uk", "Ukrainian"),
                            ("ur", "Urdu"),
                            ("uz", "Uzbek"),
                            ("vi", "Vietnamese"),
                            ("zh-hans", "Simplified Chinese"),
                            ("zh-hant", "Traditional Chinese"),
                        ],
                        max_length=10,
                    ),
                ),
                ("text", models.TextField()),
                (
                    "context",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="texts",
                        to="tournesol.entitycontext",
                    ),
                ),
            ],
            options={
                "unique_together": {("context", "language")},
            },
        ),
    ]