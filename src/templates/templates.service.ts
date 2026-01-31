import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Template } from '../entities/template.entity';
import { Hostname } from '../entities/hostname.entity';
import { TemplateUserPersonalization } from '../entities/template-user-personalization.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,

    @InjectRepository(Hostname)
    private hostnameRepository: Repository<Hostname>,

    @InjectRepository(TemplateUserPersonalization)
    private templateUserPersonalizationRepository: Repository<TemplateUserPersonalization>,
  ) {
    // Register Handlebars helpers
    this.registerHandlebarsHelpers();
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHandlebarsHelpers() {
    // Helper for if/else conditions
    Handlebars.registerHelper('if', function (conditional, options) {
      if (conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    // Helper for each loops
    Handlebars.registerHelper('each', function (context, options) {
      let ret = '';
      for (let i = 0; i < context.length; i++) {
        ret = ret + options.fn(context[i]);
      }
      return ret;
    });
  }

  /**
   * Get all templates
   */
  async findAll(): Promise<Template[]> {
    return this.templateRepository.find();
  }

  /**
   * Get template by ID
   */
  async findById(id: number): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  /**
   * Render template for a specific hostname
   */
  async renderTemplate(hostname: string): Promise<string> {
    // Find hostname
    const hostnameRecord = await this.hostnameRepository.findOne({
      where: { hostname: hostname.toLowerCase() },
      relations: ['templateUserPersonalizations'],
    });

    if (!hostnameRecord) {
      throw new NotFoundException(`Hostname ${hostname} not found`);
    }

    // Check if there's a custom template personalization
    let templateData: any;
    let templateFolder: string;

    if (hostnameRecord.templateUserPersonalizations?.length > 0) {
      // Use personalized template
      const personalization = hostnameRecord.templateUserPersonalizations[0];

      // Get the base template
      const baseTemplate = await this.templateRepository.findOne({
        where: { id: personalization.template_id },
      });

      if (!baseTemplate) {
        throw new NotFoundException('Template not found');
      }

      templateFolder = baseTemplate.folder_template;

      // Merge base template with personalization
      const baseData = JSON.parse(baseTemplate.template_json);
      const customData = JSON.parse(personalization.template_json_personalization);

      templateData = this.mergeTemplateData(baseData, customData);
    } else {
      // Use default template (first one or specified)
      const defaultTemplate = await this.templateRepository.findOne({
        where: { id: 1 }, // Default to professional-business
      });

      if (!defaultTemplate) {
        throw new NotFoundException('Default template not found');
      }

      templateFolder = defaultTemplate.folder_template;
      templateData = JSON.parse(defaultTemplate.template_json);
    }

    // Read template file
    const templatePath = path.join(
      __dirname,
      '../../src/customPages',
      templateFolder,
      'index.html',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template file not found: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // Compile template
    const template = Handlebars.compile(templateSource);

    // Render template with data
    const renderedHtml = template(templateData);

    return renderedHtml;
  }

  /**
   * Create or update template personalization for a hostname
   */
  async createPersonalization(
    hostnameId: number,
    userId: number,
    templateId: number,
    customData: any,
  ): Promise<TemplateUserPersonalization> {
    // Check if personalization already exists
    let personalization = await this.templateUserPersonalizationRepository.findOne({
      where: {
        hostname_id: hostnameId,
        user_id: userId,
      },
    });

    if (personalization) {
      // Update existing
      personalization.template_id = templateId;
      personalization.template_json_personalization = JSON.stringify(customData);
    } else {
      // Create new
      personalization = this.templateUserPersonalizationRepository.create({
        hostname_id: hostnameId,
        user_id: userId,
        template_id: templateId,
        template_json_personalization: JSON.stringify(customData),
        cobros_available: false,
      });
    }

    return this.templateUserPersonalizationRepository.save(personalization);
  }

  /**
   * Get template personalization for a hostname
   */
  async getPersonalization(
    hostnameId: number,
    userId: number,
  ): Promise<TemplateUserPersonalization | null> {
    return this.templateUserPersonalizationRepository.findOne({
      where: {
        hostname_id: hostnameId,
        user_id: userId,
      },
      relations: ['template'],
    });
  }

  /**
   * Merge base template data with custom data
   */
  private mergeTemplateData(base: any, custom: any): any {
    const merged = { ...base };

    // Merge sections
    if (custom.sections) {
      merged.sections = {
        ...base.sections,
        ...custom.sections,
      };

      // Deep merge each section
      for (const key in custom.sections) {
        if (base.sections[key]) {
          merged.sections[key] = {
            ...base.sections[key],
            ...custom.sections[key],
          };
        }
      }
    }

    // Merge theme
    if (custom.theme) {
      merged.theme = {
        ...base.theme,
        ...custom.theme,
      };
    }

    // Override company name if provided
    if (custom.companyName) {
      merged.companyName = custom.companyName;
    }

    return merged;
  }
}
