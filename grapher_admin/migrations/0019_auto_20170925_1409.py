# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-09-25 14:09
from __future__ import unicode_literals

from django.db import migrations
import lxml.html


def assign_codes_to_clioinfra_vars(apps, schema_editor):
    # the function will extract the variable code from source description
    # and will set the code as the variable's code in the database
    Variable = apps.get_model('grapher_admin', 'Variable')
    Dataset = apps.get_model('grapher_admin', 'Dataset')
    all_vars = Variable.objects.filter(
        fk_dst_id__in=[item['id'] for item in Dataset.objects.filter(namespace='clioinfra').values('id')])

    for each in all_vars:
        html = lxml.html.fromstring(each.sourceId.description)
        all_tds = html.xpath('//td')

        for i in range(0, len(all_tds)):
            if all_tds[i].text == "Link":
                link = all_tds[i + 1].xpath('//a/@href')[0]

        var_code = link[link.rfind('/') + 1:]
        each.code = var_code
        each.save()


class Migration(migrations.Migration):

    dependencies = [
        ('grapher_admin', '0018_cloudflarepurgequeue'),
    ]

    operations = [
        migrations.RunPython(assign_codes_to_clioinfra_vars)
    ]
